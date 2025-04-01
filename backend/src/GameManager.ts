import { Game, getFutureTimestamp } from "./Game";
import { Avatar, Socket } from "./types";
import { v4 as uuidv4 } from "uuid";
import { io } from "./app";
import { Player } from "./types";

const MINIMUM_PLAYERS = 2;

const use = (func: (...args: any) => any, ...extraArgs: any) => {
  return (...args: any) => {
    func(...args, ...extraArgs);
  };
};

const playerDefaults = {
  points: 0,
  isDrawing: false,
  canDrawThisRound: true,
  hasGuessed: false,
  roundIncrement: 0,
};

export class GameManager {
  games: Record<string, Game>;
  queue: Record<string, Game>;
  gameStartTimeout: NodeJS.Timeout | null;

  constructor() {
    this.games = {};
    this.queue = {};
    this.gameStartTimeout = null;
  }

  addHandler(socket: Socket) {
    const handleJoinGameBound = use(this.handleJoinGame.bind(this), socket);
    const handleConnectToGameBound = use(
      this.handleConnectToGame.bind(this),
      socket
    );

    socket.on("client:join_game", handleJoinGameBound);
    socket.on("client:connect_to_game", handleConnectToGameBound);

    socket.on("disconnect", () => {
      if (socket.data?.gameId) {
        const game =
          this.queue[socket.data.gameId] || this.games[socket.data.gameId];
        const message = `${socket.data.username} left the game`;

        if (game.state === "queue") {
          game.removePlayer(socket);

          if (game.players.length < 2) {
            game.countdownTarget = null;
            clearTimeout(this.gameStartTimeout!);
            this.gameStartTimeout = null;
          }

          game.broadcast("server:update_game", game.getSerializableValue());
          game.broadcast("server:message", { type: "green", message });
          return;
        }

        if (game.players.length <= 1) return;

        if (game.players.length === 2) {
          game.removePlayer(socket);
          game.endGame();

          return;
        }

        // if drawer left, cancel turn
        if (game.drawer?.socket.id === socket.id) return game.cancelTurn();

        game.removePlayer(socket);

        if (game.players.length === 0) {
          delete this.games[game.id];
        } else {
          game.broadcastUpdate();
          game.broadcast("server:message", { type: "red", message });
        }
      }
      socket.off("client:join_game", handleJoinGameBound);
      socket.off("client:connect_to_game", handleConnectToGameBound);
    });
  }

  handleJoinGame(
    userId: string,
    username: string,
    avatar: Avatar,
    callback: (gameId: string) => void,
    socket: Socket
  ) {
    const game = Object.values(this.queue)[0] || this.createGame();

    socket.data = {
      ...playerDefaults,
      id: userId,
      username,
      avatar,
      gameId: game.id,
    };

    const player: Player = {
      ...playerDefaults,
      socket,
      id: userId,
      username,
      avatar,
    };

    game.addPlayer(player);
    callback(game.id);
    if (game.players.length >= MINIMUM_PLAYERS) {
      if (this.gameStartTimeout) {
        return;
      }

      game.countdownTarget = getFutureTimestamp(15000);
      game.broadcast("server:update_game", game.getSerializableValue());

      this.gameStartTimeout = setTimeout(() => {
        this.games[game.id] = game;
        delete this.queue[game.id];
        game.start();
      }, 15000);
    }
  }

  createGame() {
    const gameId = uuidv4();
    const game = new Game(gameId);
    this.queue[gameId] = game;

    return game;
  }

  // connects a player to the given gameId if player exists in that game or was in that game
  handleConnectToGame(
    gameId: string,
    userId: string,
    callback: (error: boolean) => void,
    socket: Socket
  ) {
    const game = this.queue[gameId] || this.games[gameId];

    if (!game) return callback(true);

    const playerInMemory = game.playersMemory.find(
      (player) => player.id === userId
    );

    if (!playerInMemory) return callback(true);

    const room = io.sockets.adapter.rooms.get(gameId) as Set<string>;

    let hasReconnected = false;

    // this means a player is reconnecting
    if (!room.has(socket.id)) {
      hasReconnected = true;
      game.addPlayer({
        socket,
        ...playerInMemory,
      });
    }

    const message = `${playerInMemory.username} has ${
      hasReconnected ? "reconnected to" : "joined"
    } the game`;

    game.broadcast("server:update_game", game.getSerializableValue());
    game.broadcast("server:message", { type: "green", message });
  }
}
