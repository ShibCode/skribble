/// <reference types="vite/client" />

type Avatar = {
  body: number;
  eyes: number;
  mouth: number;
};

type Player = {
  id: string;
  username: string;
  avatar: Avatar;
  points: number;
  isDrawing: boolean;
  hasGuessed: boolean;
  roundIncrement: number;
};

type GameState =
  | "queue"
  | "showing_round_number"
  | "picking_word"
  | "drawing"
  | "revealing_word"
  | "result";

type Game = {
  id: string;
  players: Player[];
  state: GameState;
  round: number | null;
  word: string | null;
  countdownTarget: string | null;
};

type Message =
  | {
      type: "text" | "text-private";
      message: string;
      from: string;
    }
  | {
      type: "green" | "blue";
      message: string;
    };
