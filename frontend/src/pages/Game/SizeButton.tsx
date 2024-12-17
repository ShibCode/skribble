import { sizes } from "./DrawControlsProvider";

type SizeButtonProps = {
  size: number;
  onClick?: () => void;
  className?: string;
};

const SizeButton = ({ className = "", size, onClick }: SizeButtonProps) => {
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

export default SizeButton;
