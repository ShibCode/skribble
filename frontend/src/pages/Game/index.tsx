import Canvas from "./Canvas";
import DrawControls from "./DrawControls";
import GameChat from "./GameChat";
import GameHeader from "./GameHeader";
import GameLeaderboards from "./GameLeaderboards";
import GameProvider from "./GameProvider";

const Game = () => {
  return (
    <GameProvider>
      <div className="flex justify-center">
        <div className="w-[90%] max-w-[1312px] flex flex-col items-start gap-3 py-6">
          <img src="/logo.gif" alt="logo" className="max-w-[312px]" />

          <div className="w-full grid grid-cols-[200px_1fr_300px] gap-1.5">
            <GameHeader />

            <GameLeaderboards />

            <div className="flex flex-col gap-1.5">
              <Canvas />
              <DrawControls />
            </div>

            <GameChat />
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Game;
