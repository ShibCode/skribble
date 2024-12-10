import { useEffect } from "react";

type ActionButtonProps = {
  isActive?: boolean;
  keybind: string;
  icon: string;
  alt: string;
  onClick: (() => void) | undefined;
};

const ActionButton = ({
  isActive,
  keybind,
  icon,
  alt,
  onClick,
}: ActionButtonProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === keybind.toLowerCase() &&
        typeof onClick === "function"
      )
        onClick();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className={`size-12 rounded-[4px] relative transition-all duration-200 group ${
        isActive ? "bg-purple" : "bg-white hover:bg-[#c5c5c5]"
      }`}
    >
      <span className="absolute top-0.5 left-0.5 text-xs font-bold !leading-none">
        {keybind}
      </span>
      <img
        src={icon}
        alt={alt}
        className={`transition-all duration-200 hover:-translate-y-1 ${
          isActive
            ? "saturate-100"
            : "saturate-[0.25] group-hover:saturate-100 opacity-[0.75] group-hover:opacity-100"
        }`}
      />
    </button>
  );
};

export default ActionButton;
