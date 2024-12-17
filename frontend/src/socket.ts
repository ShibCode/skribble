import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? "https://skribble-0hzb.onrender.com"
    : "http://localhost:8080";

export const socket = io(URL);
