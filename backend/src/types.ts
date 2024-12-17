import { Socket as SocketOriginal } from "socket.io";

export type Path = {
  points: { x: number; y: number }[];
  color: string | CanvasGradient | CanvasPattern;
  width: number;
};

export type ClientToServerEvents = {
  "client:join_game": (
    userId: string,
    username: string,
    avatar: Avatar,
    callback: (gameId: string) => void
  ) => void;
  "client:connect_to_game": (
    gameId: string,
    userId: string,
    callback: (error: boolean) => void
  ) => void;
  "client:message": (message: string, fromId: string) => void;
  "client:draw": (paths: Path[]) => void;
};

export type ServerToClientEvents = {
  "server:update_game": (game: ClientGame) => void;
  "server:pick_word": (
    options: string[],
    onPick: (word: string) => void
  ) => void;
  "server:message": (message: Message) => void;
  "server:draw": (paths: Path[]) => void;
};

export type Avatar = {
  body: number;
  eyes: number;
  mouth: number;
};

export type Socket = SocketOriginal<ClientToServerEvents, ServerToClientEvents>;

export type Player = {
  socket: Socket;
  id: string;
  username: string;
  avatar: Avatar;
  points: number;
  isDrawing: boolean;
  canDrawThisRound: boolean;
  hasGuessed: boolean;
  roundIncrement: number;
};

export type GameState =
  | "queue"
  | "showing_round_number"
  | "picking_word"
  | "drawing"
  | "revealing_word"
  | "result";

export type ClientGame = {
  id: string;
  players: Omit<Player, "socket">[];
  state: GameState;
  round: number | null;
  word: string | null;
  countdownTarget: string | null;
};

export type Message =
  | {
      type: "text" | "text-private";
      message: string;
      from: string;
    }
  | {
      type: "green" | "blue";
      message: string;
    };
