import { useGame } from "../../context/GameProvider";

const Canvas = () => {
  return (
    <div className="bg-white rounded-[4px] w-full aspect-[800/600] relative">
      <OverlayBackground />

      <canvas
        id="board"
        width={800}
        height={600}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

export default Canvas;

const OverlayBackground = () => {
  const { game } = useGame();

  return (
    <div
      className={`absolute inset-0 bg-overlay transition-all duration-500 ${
        game?.state === "drawing" ? "pointer-events-none opacity-0" : ""
      }`}
    />
  );
};
