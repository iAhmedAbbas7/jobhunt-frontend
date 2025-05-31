// <= IMPORTS =>
import { motion, AnimatePresence } from "framer-motion";

// <= BUBBLE VARIANTS =>
const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: [1, 1.2, 1],
    y: [0, -5, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const TypingBubble = ({ show, other }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          title={`${other} Typing`}
          key="typing-bubble"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={bubbleVariants}
          className="bg-color-LB"
          style={{
            position: "absolute",
            width: "3rem",
            height: "3rem",
            bottom: "5rem",
            left: "1rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: "white",
            zIndex: 1000,
          }}
        >
          💬
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingBubble;
