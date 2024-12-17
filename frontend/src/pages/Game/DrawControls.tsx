import { useState } from "react";
import { colors, sizes, useDrawControls } from "./DrawControlsProvider";
import ActionButton from "./ActionButton";
import SizeButton from "./SizeButton";

const DrawControls = () => {
  const { color, tool, setTool, clear, undo } = useDrawControls();

  return (
    <div className="h-12 flex justify-between flex-wrap gap-1.5">
      <div className="flex gap-1.5">
        <div className="size-12 rounded-[4px] relative overflow-hidden">
          <div
            style={{ backgroundColor: color.primary }}
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

        <ColorPallete />

        <SizePallete />
      </div>

      <div className="flex gap-1.5">
        <ActionButton
          keybind="B"
          icon="/pen.gif"
          alt="pen"
          isActive={tool === "pen"}
          onClick={() => setTool("pen")}
        />

        <ActionButton
          keybind="F"
          icon="/fill.gif"
          alt="fill"
          isActive={tool === "fill"}
          onClick={() => setTool("fill")}
        />
      </div>

      <div className="flex gap-1.5">
        <ActionButton keybind="U" icon="/undo.gif" alt="undo" onClick={undo} />
        <ActionButton
          keybind="C"
          icon="/clear.gif"
          alt="clear"
          onClick={clear}
        />
      </div>
    </div>
  );
};

export default DrawControls;

const ColorPallete = () => {
  const { changeColor } = useDrawControls();

  return (
    <div className="grid grid-cols-[repeat(13,24px)] h-12 rounded-[4px] overflow-hidden">
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
  );
};

const SizePallete = () => {
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const { size, setSize } = useDrawControls();

  return (
    <div className="relative">
      <SizeButton
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
          isSizeModalOpen ? "-translate-y-1" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-[4px] overflow-hidden bg-white shadow-[0px_0px_10px_-3px_black] flex flex-col">
          {sizes.map((s, i) => (
            <SizeButton
              key={i}
              size={i + 1}
              onClick={() => {
                setSize(s);
                setIsSizeModalOpen(false);
              }}
              className={size === s ? "!bg-purple !hover:bg-purple" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
