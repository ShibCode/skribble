import { Game } from "./Game";
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

  constructor() {
    this.games = {};
    this.queue = {};
  }

  addHandler(socket: Socket) {
    socket.on("client:join_game", use(this.handleJoinGame.bind(this), socket));
    socket.on(
      "client:connect_to_game",
      use(this.handleConnectToGame.bind(this), socket)
    );
  }

  handleJoinGame(
    userId: string,
    username: string,
    avatar: Avatar,
    callback: (gameId: string) => void,
    socket: Socket
  ) {
    const player: Player = {
      ...playerDefaults,
      socket,
      id: userId,
      username,
      avatar,
    };

    const game = Object.values(this.queue)[0] || this.createGame();
    game.addPlayer(player);
    callback(game.id);
    if (game.players.length >= MINIMUM_PLAYERS) {
      this.games[game.id] = game;
      delete this.queue[game.id];
      setTimeout(() => game.start(), 2000);
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
