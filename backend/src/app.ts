import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { GameManager } from "./GameManager";
import { ClientToServerEvents, ServerToClientEvents } from "./types";

const app = express();
const server = http.createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  }
);

const gameManager = new GameManager();

io.on("connection", (socket) => {
  gameManager.addHandler(socket);
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
