import { useEffect, useState } from "react";

type CountdownProps = {
  targetTime: string; // ISOString
};

const Countdown = ({ targetTime: targetTimeString }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const targetTime = new Date(targetTimeString).getTime();
    return Math.max(0, Math.round((targetTime - currentTime) / 1000));
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      }
    };

    updateTimeLeft();

    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetTimeString]);

  return timeLeft;
};

export default Countdown;
