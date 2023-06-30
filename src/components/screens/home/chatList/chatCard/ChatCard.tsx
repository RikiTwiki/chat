import { FC, HTMLAttributes } from "react";
import styles from "./ChatCard.module.scss";
import cn from "classnames";

export interface IProps extends HTMLAttributes<HTMLElement> {
  className: string;
  duration?: number;
}

const ChatCard: FC<IProps> = ({
  className = "assistant",
  children,
  ...rest
}) => {
  return (
    <div className={cn(styles[className], styles.wrapper)} {...rest}>
      {children}
    </div>
  );
};

export default ChatCard;
