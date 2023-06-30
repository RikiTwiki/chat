import cn from "classnames";
import { ButtonHTMLAttributes, FC } from "react";

import styles from "./Button.module.scss";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
}
const Button: FC<IButton> = ({
  children,
  width,
  className = "primary",
  ...rest
}) => {
  return (
    <button
      className={cn(styles[className], styles.btn)}
      style={{ minWidth: width }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
