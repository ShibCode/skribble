import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production" ? undefined : "http://localhost:8080";

export const socket = io(URL);
