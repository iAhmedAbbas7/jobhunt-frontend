// <= IMPORTS =>
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  // STATE MANAGEMENT
  const [isVisible, setIsVisible] = useState(false);
  // EFFECT TO MAKE IT APPEAR AFTER 1200PX
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 1200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    // ADDING EVENT LISTENER
    window.addEventListener("scroll", toggleVisibility);
    // REMOVE EVENT LISTENER
    return () => window.removeEventListener("scroll", toggleVisibility);
  });
  // SCROLLING TO TOP
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // IF NOT VISIBLE
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-16 bg-color-DB text-white p-2 rounded-full hover:bg-color-LB border-none outline-none focus:outline-none transition-all duration-500 ease-in-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }  z-50`}
    >
      <ArrowUp />
    </button>
  );
};

export default ScrollToTop;
