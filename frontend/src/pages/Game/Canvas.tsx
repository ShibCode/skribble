import { useGame } from "../../context/GameProvider";
import { useEffect, useRef } from "react";
import { useDrawControls } from "./DrawControlsProvider";

const Canvas = () => {
  const { me } = useGame();
  const { size, color } = useDrawControls();

  const cursor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const handleMouseEnter = () => {
    if (cursor.current) {
      cursor.current.style.display = "block";
    }
  };

  const handleMouseLeave = () => {
    if (cursor.current) {
      cursor.current.style.display = "none";
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.left = `${e.clientX}px`;
        cursor.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("pointermove", handleMouseMove);
    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (cursor.current && canvas.current) {
        const { width, height } = canvas.current.getBoundingClientRect();

        cursor.current.style.width = `${
          size * 1.1 * (width / canvas.current.width)
        }px`;
        cursor.current.style.height = `${
          size * 1.1 * (height / canvas.current.height)
        }px`;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [size]);

  return (
    <div
      className="bg-white rounded-[4px] w-full aspect-[800/600] relative"
      style={{ clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)" }}
    >
      <OverlayBackground />

      {me?.isDrawing && (
        <div
          ref={cursor}
          style={{ display: "none", color: color.primary }}
          className="rounded-full fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none box-content"
        >
          <div className="size-full opacity-80 rounded-full bg-current" />
          <div className="absolute -inset-0.5 border border-black rounded-full" />
        </div>
      )}

      <canvas
        ref={canvas}
        id="board"
        width={800}
        height={600}
        className={`w-full h-full ${me?.isDrawing ? "cursor-none" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
