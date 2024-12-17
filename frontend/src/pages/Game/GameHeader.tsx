import Countdown from "../../components/Countdown";
import { useGame } from "../../context/GameProvider";

const GameHeader = () => {
  const { me, game } = useGame();

  return (
    <div className="bg-white rounded-[4px] col-span-3 h-12 flex items-center justify-between">
      <div className="flex items-center gap-2 h-full -ml-2">
        <div className="relative">
          <img src="/clock.gif" alt="" />
          <span className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 text-black text-xl font-extrabold tracking-tight">
            {game?.countdownTarget ? (
              <Countdown targetTime={game.countdownTarget} />
            ) : (
              "0"
            )}
          </span>
        </div>

        <div className="text-xl font-bold translate-y-0.5">
          Round {game?.round} of 10
        </div>
      </div>

      {game?.state === "drawing" || game?.state === "revealing_word" ? (
        me?.isDrawing ? (
          <div className="flex flex-col items-center h-full justify-between pt-[7px] pb-[3px] relative">
            <span className="text-sm text-gray-500 !leading-none">
              DRAW THIS
            </span>

            <div className="font-bold text-xl !leading-none flex gap-1">
              {game?.word}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full justify-between pt-[7px] pb-[3px] relative">
            <span className="text-sm text-gray-500 !leading-none">
              GUESS THIS
            </span>

            <div className="absolute left-[110%] top-1/2 -translate-y-1/2 text-xs leading-none flex gap-1">
              {game.word?.split(" ").map((part, i) => (
                <span key={i}>{part.length}</span>
              ))}
            </div>

            <div className="font-bold text-xl !leading-none flex gap-1">
              {game?.word}
            </div>
          </div>
        )
      ) : (
        <div>
          <span className="text-sm text-gray-500 !leading-none">WAITING</span>
        </div>
      )}

      <div className="mr-0.5">
        <img src="/settings.gif" alt="" className="h-11" />
      </div>
    </div>
  );
};

export default GameHeader;
