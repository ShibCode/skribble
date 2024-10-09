import { useState } from "react";
import { colors, sizes, useGameContext } from "./GameProvider";

const DrawControls = () => {
  const { color, changeColor, size, setSize, tool, setTool, clear, undo } =
    useGameContext();

  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  return (
    <div className="h-12 flex justify-between">
      <div className="flex gap-1.5">
        <div className="size-12 rounded-[4px] relative overflow-hidden">
          <div
            style={{
              backgroundColor: color.primary,
            }}
            className="absolute inset-0"
          ></div>
          <div
            style={{
              backgroundColor: color.secondary,
              clipPath: "polygon(85% 0%, 15% 100%, 100% 100%, 100% 0%)",
            }}
            className="absolute inset-0"
          ></div>
        </div>

        <div className="grid grid-cols-[repeat(13,24px)] h-full rounded-[4px] overflow-hidden">
          {colors.map((color) => (
            <button
              onClick={() => changeColor("primary", color)}
              onContextMenu={(e) => {
                e.preventDefault();
                changeColor("secondary", color);
              }}
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="relative">
          <SizeItem
            className="rounded-[4px]"
            size={sizes.indexOf(size) + 1}
            onClick={() => setIsSizeModalOpen((prev) => !prev)}
          />

          {isSizeModalOpen && (
            <div
              className="inset-0 fixed"
              onClick={() => setIsSizeModalOpen(false)}
            />
          )}

          <div
            className={`absolute bottom-full flex flex-col items-center transition-all duration-200 ${
              isSizeModalOpen
                ? "-translate-y-1"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="rounded-[4px] overflow-hidden bg-white shadow-[0px_0px_10px_-3px_black] flex flex-col">
              {sizes.map((size, i) => (
                <SizeItem
                  key={i}
                  size={i + 1}
                  onClick={() => {
                    setSize(size);
                    setIsSizeModalOpen(false);
                  }}
                  className={size === size ? "bg-purple hover:bg-purple" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={() => setTool("pen")}
          className={`size-12 rounded-[4px] relative transition-all duration-200 group ${
            tool === "pen" ? "bg-purple" : "bg-white hover:bg-[#c5c5c5]"
          }`}
        >
          <span className="absolute top-0.5 left-0.5 text-xs font-bold !leading-none">
            B
          </span>
          <img
            src="/pen.gif"
            alt="pen"
            className={`transition-all duration-200 hover:-translate-y-1 ${
              tool == "pen"
                ? "saturate-100"
                : "saturate-[0.25] group-hover:saturate-100 opacity-[0.75] group-hover:opacity-100"
            }`}
          />
        </button>

        {/* <button
          onClick={() => setTool("fill")}
          className={`size-12 rounded-[4px] relative transition-all duration-200 group ${
            tool === "fill" ? "bg-purple" : "bg-white hover:bg-[#c5c5c5]"
          }`}
        >
          <span className="absolute top-0.5 left-0.5 text-xs font-bold !leading-none">
            F
          </span>
          <img
            src="/fill.gif"
            alt="fill"
            className={`transition-all duration-200 hover:-translate-y-1 ${
              tool == "fill"
                ? "saturate-100"
                : "saturate-[0.25] group-hover:saturate-100 opacity-[0.75] group-hover:opacity-100"
            }`}
          />
        </button> */}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={undo}
          className={`size-12 rounded-[4px] relative transition-all duration-200 bg-white hover:bg-[#c5c5c5] group`}
        >
          <span className="absolute top-0.5 left-0.5 text-xs font-bold !leading-none">
            U
          </span>
          <img
            src="/undo.gif"
            alt="undo"
            className={`transition-all duration-200 hover:-translate-y-1 opacity-[0.75] group-hover:opacity-100 saturate-[0.25] group-hover:saturate-100`}
          />
        </button>

        <button
          onClick={clear}
          className={`size-12 rounded-[4px] relative transition-all duration-200 bg-white hover:bg-[#c5c5c5] group`}
        >
          <span className="absolute top-0.5 left-0.5 text-xs font-bold !leading-none">
            C
          </span>
          <img
            src="/clear.gif"
            alt="clear"
            className={`transition-all duration-200 hover:-translate-y-1 opacity-[0.75] group-hover:opacity-100 saturate-[0.25] group-hover:saturate-100`}
          />
        </button>
      </div>
    </div>
  );
};

export default DrawControls;

type SizeItemProps = {
  size: number;
  onClick?: () => void;
  className?: string;
};

const SizeItem = ({ className = "", size, onClick }: SizeItemProps) => {
  return (
    <button
      className={`bg-white hover:bg-[#c5c5c5] transition-all duration-200 size-12 relative isolate group ${className}`}
      onClick={onClick}
    >
      <div
        style={{
          backgroundImage: "url(/size.gif)",
          backgroundSize: `calc((100%/${sizes.length})*${size})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="invert w-full h-full drop-shadow-[3px_3px_0px_#00000025] group-hover:-translate-y-1 transition-all duration-200"
      ></div>
    </button>
  );
};
