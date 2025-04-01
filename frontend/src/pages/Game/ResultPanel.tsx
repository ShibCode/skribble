import { useMemo } from "react";
import Avatar from "../../components/Avatar";
import { useGame } from "../../context/GameProvider";

interface PlayerProps {
  avatar: Avatar;
  username: string;
  position: number;
}

const positionClasses: Record<string, string> = {
  "1": "text-yellow-400 text-4xl",
  "2": "text-gray-300 text-3xl",
  "3": "text-amber-800 text-2xl",
  rest: "text-white",
};

const ResultPanel = () => {
  const { game } = useGame();

  const sortedPlayers = useMemo(
    () => (game ? [...game.players].sort((a, b) => b.points - a.points) : []),
    []
  );

  return (
    <>
      <h2 className="text-3xl">Result</h2>

      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-16">
          {sortedPlayers.slice(0, 3).map((player, i) => (
            <Player
              key={i}
              avatar={player.avatar}
              username={player.username}
              position={i + 1}
            />
          ))}
        </div>

        <div className="flex justify-center gap-y-6 gap-x-10 flex-wrap px-10">
          {sortedPlayers.slice(3).map((player, i) => (
            <Player
              key={i}
              avatar={player.avatar}
              username={player.username}
              position={i + 4}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultPanel;

const Player = ({ avatar, username, position }: PlayerProps) => {
  return (
    <div className="relative text-center">
      <Avatar {...avatar} size={position <= 3 ? 96 : 48} />
      <p
        className={`!leading-[1] font-bold ${
          position <= 3 ? "text-base" : "text-sm"
        }`}
      >
        {username}
      </p>

      <span
        className={`absolute left-full top-[40%] -translate-y-1/2 font-bold ${
          positionClasses[String(position)] || positionClasses.rest
        }`}
      >
        #{position}
      </span>
    </div>
  );
};
