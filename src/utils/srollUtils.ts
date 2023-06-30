import { RefObject } from "react";

export const scrollBottom = (ref: RefObject<HTMLInputElement>) => {
  if (ref?.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};
