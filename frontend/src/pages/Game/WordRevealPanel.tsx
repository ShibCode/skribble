import { useGame } from "../../context/GameProvider";

const WordRevealPanel = () => {
  const { game } = useGame();

  return (
    <>
      <div className="text-center space-y-1">
        <h2 className="text-3xl">
          The word was <strong className="text-[#FEE7BF]">{game?.word}</strong>
        </h2>
        <p className="text-xl text-[#CACED8]">Time is up!</p>
      </div>

      <ul className="w-full max-w-[300px]">
        {game?.players.map((player) => (
          <PlayerPointItem
            key={player.id}
            username={player.username}
            increment={player.roundIncrement}
          />
        ))}
      </ul>
    </>
  );
};

export default WordRevealPanel;

const PlayerPointItem = ({
  username,
  increment,
}: {
  username: string;
  increment: number;
}) => {
  return (
    <li className="flex justify-between text-xl !leading-[1.25]">
      <span className="font-medium">{username}</span>
      <span
        className={`font-bold ${
          increment > 0 ? "text-[#3BD03B]" : "text-[#BE1E26]"
        }`}
      >
        {increment > 0 ? "+" : ""}
        {increment}
      </span>
    </li>
  );
};
