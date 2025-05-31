// <= IMPORTS =>
import { useEffect } from "react";

const ScrollRestorationDisabler = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  return null;
};

export default ScrollRestorationDisabler;
