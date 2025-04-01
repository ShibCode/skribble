import Avatar from "../../components/Avatar";
import { useGame } from "../../context/GameProvider";

const GameLeaderboards = () => {
  const { game, me } = useGame();

  const sortedPlayers = game
    ? [...game.players].sort((a, b) => b.points - a.points)
    : [];

  return (
    <div className="bg-white rounded-[4px] flex flex-col h-max">
      {game?.players.map((player, i) => (
        <Player
          key={i}
          player={player}
          position={sortedPlayers.findIndex((p) => p.id === player.id) + 1}
          isYou={player.id === me?.id}
        />
      ))}
    </div>
  );
};

export default GameLeaderboards;

type PlayerProps = {
  player: Player;
  position: number;
  isYou: boolean;
};

const Player = ({ player, position, isYou }: PlayerProps) => {
  return (
    <div
      className={`h-12 relative flex items-center justify-end ${
        player.hasGuessed
          ? "even:bg-[#48C737] odd:bg-[#5BDD4A]"
          : "even:bg-[#ececec] odd:bg-white"
      }`}
    >
      <span className="absolute top-1 left-1 font-bold text-sm">
        #{position}
      </span>

      <div className="flex flex-col items-center gap-0.5 absolute left-1/2 -translate-x-1/2 translate-y-px max-w-[50%]">
        <span
          className={`text-sm font-bold !leading-none flex w-full gap-[0.2em] ${
            isYou ? "text-blue-500" : ""
          }`}
        >
          <span className="truncate">{player.username} </span>
          {isYou && <span className="shrink-0">(you)</span>}
        </span>
        <span className="text-[13px] !leading-none">
          {player.points} points
        </span>
      </div>

      <div className="relative flex items-center">
        {player.isDrawing && (
          <img src="/pen.gif" alt="pen" className="absolute w-11 right-[65%]" />
        )}

        <Avatar size={48} {...player.avatar} crown={position === 1} />
      </div>
    </div>
  );
};
