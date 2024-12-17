import { useState } from "react";

type ArrowProps = {
  direction: "left" | "right";
};

const Arrow = ({ direction }: ArrowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const y = direction === "left" ? "0%" : "100%";

  return (
    <div
      style={{
        backgroundImage: "url(/arrow.gif)",
        backgroundSize: "200%",
        backgroundPosition: `${isHovered ? "100%" : "0%"} ${y}`,
        imageRendering: "pixelated",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full arrow"
    />
  );
};

export default Arrow;
