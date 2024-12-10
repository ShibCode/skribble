import { createContext, useContext, useEffect, useRef, useState } from "react";
import { initialize } from "../../canvas";

export const colors = [
  "rgb(255, 255, 255)",
  "rgb(193, 193, 193)",
  "rgb(239, 19, 11)",
  "rgb(255, 113, 0)",
  "rgb(255, 228, 0)",
  "rgb(0, 204, 0)",
  "rgb(0, 255, 145)",
  "rgb(0, 178, 255)",
  "rgb(35, 31, 211)",
  "rgb(163, 0, 186)",
  "rgb(223, 105, 167)",
  "rgb(255, 172, 142)",
  "rgb(160, 82, 45)",
  "rgb(0, 0, 0)",
  "rgb(80, 80, 80)",
  "rgb(116, 11, 7)",
  "rgb(194, 56, 0)",
  "rgb(232, 162, 0)",
  "rgb(0, 70, 25)",
  "rgb(0, 120, 93)",
  "rgb(0, 86, 158)",
  "rgb(14, 8, 101)",
  "rgb(85, 0, 105)",
  "rgb(135, 53, 84)",
  "rgb(204, 119, 77)",
  "rgb(99, 48, 13)",
] as const;

export const sizes = [2, 5, 12, 20, 40] as const;

type Size = (typeof sizes)[number];

type ColorSingular = (typeof colors)[number];

type Color = {
  primary: (typeof colors)[number];
  secondary: (typeof colors)[number];
};

type Tool = "pen" | "fill";

type GameContextType = {
  color: Color;
  tool: Tool;
  size: Size;
  setSize: React.Dispatch<React.SetStateAction<Size>>;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
  changeColor: (type: "primary" | "secondary", color: ColorSingular) => void;
  clear: () => void;
  undo: () => void;
  // fill: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => useContext(GameContext) as GameContextType;

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [size, setSize] = useState<Size>(sizes[1]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<Color>({
    primary: "rgb(0, 0, 0)",
    secondary: "rgb(255, 255, 255)",
  });
  const [actions, setActions] = useState({ undo: () => {}, clear: () => {} });

  const changeColor = (type: "primary" | "secondary", color: ColorSingular) => {
    setColor((prev) => ({ ...prev, [type]: color }));
  };

  type ConfigType = {
    primary: string;
    secondary: string;
    size: number;
  };

  const configRef = useRef<ConfigType>();

  useEffect(() => {
    const { config, cleanupListeners, clear, undo } = initialize();

    configRef.current = config;

    setActions({ undo, clear });

    return () => {
      cleanupListeners();
    };
  }, []);

  useEffect(() => {
    if (!configRef.current) return;

    configRef.current.primary = color.primary;
    configRef.current.secondary = color.secondary;
    configRef.current.size = size;
  }, [color, size]);

  return (
    <GameContext.Provider
      value={{
        color,
        tool,
        size,
        setSize,
        setTool,
        changeColor,
        clear: actions.clear,
        undo: actions.undo,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
