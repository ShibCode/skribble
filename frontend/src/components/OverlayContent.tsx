import { AnimatePresence, motion } from "motion/react";
import React, { ComponentProps } from "react";
import { useGame } from "../context/GameProvider";

interface OverlayContentProps extends ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  state: GameState;
  className?: string;
}

const OverlayContent = ({
  children,
  state,
  className = "",
  ...props
}: OverlayContentProps) => {
  const { game } = useGame();

  return (
    <AnimatePresence>
      {game?.state === state && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className={`z-10 absolute inset-0 flex justify-center items-center text-white ${className}`}
            initial={{ y: "-100%" }}
            animate={{ y: "0%", transition: { delay: 0.15 } }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
              mass: 1,
            }}
            {...props}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OverlayContent;
