import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { v4 as uuidv4 } from "uuid";

export let userId = localStorage.getItem("id");

if (userId) {
  // do something here
} else {
  userId = uuidv4();
  // localStorage.setItem("id", userId);
}

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:gameId" element={<Game />} />
    </Routes>
  );
};

export default App;
