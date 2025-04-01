import { io } from "./app";
import {
  ClientGame,
  GameState,
  Path,
  Player,
  ServerToClientEvents,
  Socket,
} from "./types";
import words from "./words.json";

const MAX_ROUNDS = 3;

const ROUND_NUMBER_SCREEN_DURATION = 3000;
const PICKING_WORD_DURATION = 15000;
const DRAW_DURATION = 120000;
const WORD_REVEAL_SCREEN_DURATION = 5000;
const TIME_OFFSET = 1000; // to ensure the clock starts from the allowed time and ends on 0

export const getFutureTimestamp = (ms: number) => {
  return new Date(new Date().getTime() + ms).toISOString();
};

export class Game {
  id: string;
  privateChatId: string;
  playersMemory: Omit<Player, "socket">[]; // Players in the game + Players that left
  players: Player[]; // Current players in the game
  state: GameState;
  round: number;
  word: string | null;
  drawer: Player | null;
  guessCount: number;
  countdownTarget: string | null;

  revealWordTimeout: NodeJS.Timeout | null;
  pickingWordTimeout: NodeJS.Timeout | null;
  newTurnTimeout: NodeJS.Timeout | null;

  handleDrawBound: (paths: Path[]) => void;
  handleMessageBound: (message: string, fromId: string) => void;

  constructor(id: string) {
    this.id = id;
    this.privateChatId = `${id}-private`;
    this.playersMemory = [];
    this.players = [];
    this.state = "queue";
    this.round = 0;
    this.word = null;
    this.drawer = null;
    this.guessCount = 0;
    this.countdownTarget = null;
    this.revealWordTimeout = null;
    this.pickingWordTimeout = null;
    this.newTurnTimeout = null;

    this.handleDrawBound = this.handleDraw.bind(this);
    this.handleMessageBound = this.handleMessage.bind(this);
  }

  // converts the data into appropriate form to be sent to the frontend
  getSerializableValue(includeSecretInformation = false): ClientGame {
    let word = this.word;

    if (!includeSecretInformation && this.word) {
      word = this.word.replace(/\S/g, "_");
    }

    return {
      id: this.id,
      players: this.players.map(({ socket, ...p }) => p),
      state: this.state,
      round: this.round,
      word,
      countdownTarget: this.countdownTarget,
    };
  }

  // emits an event to all players in the game
  broadcast<K extends keyof ServerToClientEvents>(
    event: K,
    ...params: Parameters<ServerToClientEvents[K]>
  ) {
    io.to(this.id).emit(event, ...(params as any));
  }

  // emits an event to all players in the game that have guessed or are drawing
  broadcastPrivate<K extends keyof ServerToClientEvents>(
    event: K,
    ...params: Parameters<ServerToClientEvents[K]>
  ) {
    io.to(this.privateChatId).emit(event, ...(params as any));
  }

  broadcastUpdate() {
    if (this.state === "drawing") {
      this.drawer!.socket.to(this.id).emit(
        "server:update_game",
        this.getSerializableValue()
      );
      this.drawer!.socket.emit(
        "server:update_game",
        this.getSerializableValue(true)
      );
    } else
      this.broadcast("server:update_game", this.getSerializableValue(true));
  }

  addHandler(socket: Socket) {
    socket.on("client:message", this.handleMessageBound);
  }

  removeHandler(socket: Socket) {
    socket.off("client:message", this.handleMessageBound);
    socket.off("client:draw", this.handleDrawBound);
  }

  addPlayer({ socket, ...playerWithoutSocket }: Player) {
    this.addHandler(socket);
    socket.join(this.id);

    this.players.push({ socket, ...playerWithoutSocket });
    this.playersMemory.push(playerWithoutSocket);
  }

  removePlayer(socket: Socket) {
    this.removeHandler(socket);
    socket.leave(this.id);

    this.players = this.players.filter((p) => p.id !== socket.data!.id);

    socket.data = null;
  }

  handleMessage(message: string, fromId: string) {
    const from = this.players.find((player) => player.id === fromId)!;

    if (from.hasGuessed || from.isDrawing) {
      this.broadcastPrivate("server:message", {
        type: "text-private",
        from: from.username,
        message,
      });
      return;
    }

    const isCorrectGuess = this.state === "drawing" && this.word === message;

    if (!isCorrectGuess) {
      return this.broadcast("server:message", {
        type: "text",
        from: from.username,
        message,
      });
    }

    this.guessCount++;
    from.hasGuessed = true;
    from.roundIncrement = 1;
    this.drawer!.roundIncrement = from.roundIncrement / 2;
    from.socket.join(this.privateChatId);

    this.broadcastUpdate();
    this.broadcast("server:message", {
      type: "green",
      message: `${from.username} has guessed the word`,
    });

    if (this.guessCount === this.players.length - 1) this.revealWord();
  }

  getNextDrawer() {
    for (let i = this.players.length - 1; i >= 0; i--) {
      if (this.players[i].canDrawThisRound) {
        return this.players[i];
      }
    }
  }

  start() {
    this.startNewRound();
  }

  startNewRound() {
    this.round++;
    this.state = "showing_round_number";
    this.countdownTarget = getFutureTimestamp(ROUND_NUMBER_SCREEN_DURATION);
    this.broadcast("server:update_game", this.getSerializableValue(true));
    this.newTurnTimeout = setTimeout(() => {
      this.newTurnTimeout = null;
      this.startNextTurn();
    }, ROUND_NUMBER_SCREEN_DURATION + TIME_OFFSET);
  }

  getOptions() {
    const randomWords: string[] = [];
    const wordsLength = words.length;

    while (randomWords.length < 3) {
      const randomIndex = Math.floor(Math.random() * wordsLength);
      const randomWord = words[randomIndex];

      // Ensure no duplicates by checking if the word is already in the result array
      if (!randomWords.includes(randomWord)) {
        randomWords.push(randomWord);
      }
    }

    return randomWords;
  }

  startNextTurn() {
    this.players.forEach((player) => (player.roundIncrement = 0));

    io.to(this.id).emit("server:draw", []);

    this.state = "picking_word";
    this.countdownTarget = getFutureTimestamp(PICKING_WORD_DURATION);

    this.drawer = this.getNextDrawer() as Player;
    this.drawer.socket.join(this.privateChatId);
    this.drawer.isDrawing = true;

    const options = this.getOptions();

    this.broadcast("server:update_game", this.getSerializableValue());

    this.pickingWordTimeout = setTimeout(() => {
      this.pickingWordTimeout = null;
      this.word = words[Math.floor(Math.random() * words.length)];
      this.startDrawingPhase();
    }, PICKING_WORD_DURATION + TIME_OFFSET);

    // give drawer options to pick a word from
    this.drawer.socket.emit("server:pick_word", options, (word: string) => {
      if (!this.pickingWordTimeout) return;

      clearTimeout(this.pickingWordTimeout);
      this.pickingWordTimeout = null;
      this.word = word;
      this.startDrawingPhase();
    });
  }

  startDrawingPhase() {
    this.broadcast("server:message", {
      type: "blue",
      message: `${this.drawer!.username} is now drawing!`,
    });

    this.state = "drawing";
    this.countdownTarget = getFutureTimestamp(DRAW_DURATION);

    this.drawer!.socket.to(this.id).emit(
      "server:update_game",
      this.getSerializableValue()
    );

    // updates the drawer only with actual word
    this.drawer!.socket.emit(
      "server:update_game",
      this.getSerializableValue(true)
    );

    this.drawer!.socket.on("client:draw", this.handleDrawBound);

    this.revealWordTimeout = setTimeout(() => {
      this.revealWordTimeout = null;
      this.revealWord();
    }, DRAW_DURATION + TIME_OFFSET);
  }

  handleDraw(paths: Path[]) {
    this.drawer!.socket.to(this.id).emit("server:draw", paths);
  }

  revealWord() {
    if (this.revealWordTimeout) clearTimeout(this.revealWordTimeout);

    this.state = "revealing_word";
    this.countdownTarget = getFutureTimestamp(WORD_REVEAL_SCREEN_DURATION);
    this.guessCount = 0;

    const isNewRound = this.players.indexOf(this.drawer!) === 0;

    this.drawer!.canDrawThisRound = false;
    this.drawer!.isDrawing = false;
    this.drawer!.points += this.drawer!.roundIncrement;
    this.drawer!.socket.off("client:draw", this.handleDrawBound);

    this.players.forEach((player) => {
      if (isNewRound) player.canDrawThisRound = true; // reset if new round
      player.socket.leave(this.privateChatId);
      player.hasGuessed = false;

      if (player !== this.drawer) {
        player.points += player.roundIncrement;
      }
    });
    this.broadcast("server:update_game", this.getSerializableValue(true));

    this.newTurnTimeout = setTimeout(() => {
      this.newTurnTimeout = null;
      if (!isNewRound) return this.startNextTurn();

      if (this.round >= MAX_ROUNDS) this.endGame();
      else this.startNewRound();
    }, WORD_REVEAL_SCREEN_DURATION + TIME_OFFSET);
  }

  cancelTurn() {
    // if picking word
    if (this.state === "picking_word" && this.pickingWordTimeout) {
      clearTimeout(this.pickingWordTimeout);
      this.pickingWordTimeout = null;

      const isNewRound = this.players.indexOf(this.drawer!) === 0;

      this.removePlayer(this.drawer!.socket);
      this.drawer = null;

      if (isNewRound) this.startNewRound();
      else this.startNextTurn();
    }

    // if drawing
    if (this.state === "drawing") {
      if (this.revealWordTimeout) clearTimeout(this.revealWordTimeout);

      this.state = "revealing_word";
      this.countdownTarget = getFutureTimestamp(WORD_REVEAL_SCREEN_DURATION);
      this.guessCount = 0;

      const isNewRound = this.players.indexOf(this.drawer!) === 0;

      this.removePlayer(this.drawer!.socket);
      this.drawer = null;

      this.players.forEach((player) => {
        if (isNewRound) player.canDrawThisRound = true; // reset if new round
        player.socket.leave(this.privateChatId);
        player.hasGuessed = false;
      });
      this.broadcast("server:update_game", this.getSerializableValue(true));

      setTimeout(() => {
        if (!isNewRound) return this.startNextTurn();

        if (this.round >= MAX_ROUNDS) this.endGame();
        else this.startNewRound();
      }, WORD_REVEAL_SCREEN_DURATION + TIME_OFFSET);
    }
  }

  endGame() {
    this.state = "result";

    if (this.revealWordTimeout) {
      clearTimeout(this.revealWordTimeout);
      this.revealWordTimeout = null;
    }

    if (this.pickingWordTimeout) {
      clearTimeout(this.pickingWordTimeout);
      this.pickingWordTimeout = null;
    }

    if (this.newTurnTimeout) {
      clearTimeout(this.newTurnTimeout);
      this.newTurnTimeout = null;
    }

    this.drawer = null;
    this.word = null;

    this.countdownTarget = getFutureTimestamp(6000);

    const winner = [...this.players].sort((a, b) => b.points - a.points)[0];

    this.broadcastUpdate();
    this.broadcast("server:message", {
      type: "blue",
      message: `${winner.username} won the game!`,
    });

    setTimeout(() => {
      this.broadcast("server:message", {
        type: "blue",
        message: `Room connection has closed`,
      });
      this.destroy();
    }, 6000 + TIME_OFFSET);
  }

  destroy() {
    this.players.forEach((player) => {
      this.removeHandler(player.socket);
      player.socket.leave(this.id);
      player.socket.data = null;
    });

    this.players = [];
    this.playersMemory = [];

    this.drawer = null;
    this.word = null;
    this.countdownTarget = null;
  }
}
