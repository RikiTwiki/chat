import { FC, useEffect, useState } from "react";

export interface IProps {
  timeoutDuration: number;
  onInactive: any;
}

const InactivityTracker: FC<IProps> = ({
  timeoutDuration = 3 * 60 * 1000,
  onInactive,
}) => {
  const [isUserActive, setIsUserActive] = useState(true);
  let inactivityTimeout: NodeJS.Timeout;

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      setIsUserActive(false);
      if (onInactive) {
        onInactive();
      }
    }, timeoutDuration);
  };

  const handleUserActivity = () => {
    setIsUserActive(true);
    resetInactivityTimeout();
  };

  useEffect(() => {
    resetInactivityTimeout();

    document.addEventListener("touchstart", handleUserActivity);
    document.addEventListener("mousedown", handleUserActivity);
    document.addEventListener("mousemove", handleUserActivity);

    return () => {
      clearTimeout(inactivityTimeout);
      document.removeEventListener("touchstart", handleUserActivity);
      document.removeEventListener("mousedown", handleUserActivity);
      document.addEventListener("mousemove", handleUserActivity);
    };
  }, []);

  return <></>;
};

export default InactivityTracker;
