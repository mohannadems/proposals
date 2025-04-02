// hooks/useDirection.js
import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

export function useDirection() {
  const { isRTL } = useContext(LanguageContext);

  return {
    isRTL,
    direction: isRTL ? "rtl" : "ltr",
    flexDirection: isRTL ? "row-reverse" : "row",
    textAlign: isRTL ? "right" : "left",
    start: isRTL ? "right" : "left",
    end: isRTL ? "left" : "right",
    marginStart: (value) => ({
      marginLeft: isRTL ? 0 : value,
      marginRight: isRTL ? value : 0,
    }),
    marginEnd: (value) => ({
      marginRight: isRTL ? 0 : value,
      marginLeft: isRTL ? value : 0,
    }),
    paddingStart: (value) => ({
      paddingLeft: isRTL ? 0 : value,
      paddingRight: isRTL ? value : 0,
    }),
    paddingEnd: (value) => ({
      paddingRight: isRTL ? 0 : value,
      paddingLeft: isRTL ? value : 0,
    }),
    borderStart: (width, color) => ({
      borderLeftWidth: isRTL ? 0 : width,
      borderRightWidth: isRTL ? width : 0,
      borderLeftColor: isRTL ? undefined : color,
      borderRightColor: isRTL ? color : undefined,
    }),
    borderEnd: (width, color) => ({
      borderRightWidth: isRTL ? 0 : width,
      borderLeftWidth: isRTL ? width : 0,
      borderRightColor: isRTL ? undefined : color,
      borderLeftColor: isRTL ? color : undefined,
    }),
  };
}
