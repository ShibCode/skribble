import { createContext, useContext, useMemo, useState } from "react";
import { userId } from "../App";

type GameContextType = {
  me: Player | undefined;
  game: Game | null;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) throw new Error("useGame must be used within a GameProvider");

  return context;
};

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const me = useMemo(
    () => game?.players.find((player) => player.id === userId),
    [game]
  );

  return (
    <GameContext.Provider value={{ me, game, setGame, messages, setMessages }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
