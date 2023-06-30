import styles from "./audioRecordAnimation.module.scss";
import cn from "classnames";
import { FC, HTMLAttributes } from "react";

export interface IProps extends HTMLAttributes<HTMLElement> {
  width?: number;
  height?: number;
  className: string;
  isRecording: boolean;
}

const AudioRecordAnimation: FC<IProps> = ({
  className,
  children,
  isRecording,
  width = 80,
  height = 80,
  ...rest
}) => {
  return (
    <div
      {...rest}
      style={{ width, height }}
      className={cn(
        styles[className],
        styles["audio-record-container"],
        styles["initialAnimate"],
        isRecording ? styles["recording"] : ""
      )}
    >
      <div
        className={styles["audio-record-circle"]}
        style={{ width: width / 2, height: height / 2 }}
      />

      <div className={styles["content"]}>{children}</div>
    </div>
  );
};

export default AudioRecordAnimation;
