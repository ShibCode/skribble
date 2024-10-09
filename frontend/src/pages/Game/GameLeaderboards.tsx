const players = [{}, {}, {}, {}];

const GameLeaderboards = () => {
  // ececec

  return (
    <div className="bg-white rounded-[4px] flex flex-col overflow-hidden h-max">
      {players.map((player, i) => (
        <Player key={i} isOdd={i % 2 === 1} />
      ))}
    </div>
  );
};

export default GameLeaderboards;

type PlayerProps = {
  isOdd: boolean;
};

const Player = ({ isOdd }: PlayerProps) => {
  return (
    <div
      className={`h-12 relative flex items-center justify-end ${
        isOdd ? "bg-[#ececec]" : "bg-white"
      }`}
    >
      <span className="absolute top-1 left-1 font-bold text-sm">#1</span>

      <div className="flex flex-col items-center gap-0.5 absolute left-1/2 -translate-x-1/2 translate-y-px">
        <span className="text-sm font-bold !leading-none">Shib</span>
        <span className="text-[13px] !leading-none">540 points</span>
      </div>

      <div className="size-12 relative">
        <div
          style={{
            backgroundImage: "url(/body_atlas.gif)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0px 0px",
          }}
          className="absolute inset-0"
        ></div>
        <div
          style={{
            backgroundImage: "url(/eyes_atlas.gif)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0px 0px",
          }}
          className="absolute inset-0"
        ></div>
        <div
          style={{
            backgroundImage: "url(/mouth_atlas.gif)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0px 0px",
          }}
          className="absolute inset-0"
        ></div>
      </div>
    </div>
  );
};
