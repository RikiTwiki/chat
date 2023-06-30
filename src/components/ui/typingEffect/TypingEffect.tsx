import { FC, useLayoutEffect, useState } from "react";

export interface IProps {
  text: string;
  duration: number;
}

const TypingEffect: FC<IProps> = ({ text, duration = 10 }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    const typingTimer = setTimeout(() => {
      setCurrentText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, duration);

    return () => clearTimeout(typingTimer);
  }, [currentIndex, text]);

  return <span>{currentText}</span>;
};

export default TypingEffect;
