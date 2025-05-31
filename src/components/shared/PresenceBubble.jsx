// <= IMPORTS =>
import { motion, AnimatePresence } from "framer-motion";

// <= BUBBLE VARIANTS =>
const bubbleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const PresenceBubble = ({ show, other }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          title={`${other} Watching`}
          key="presence-bubble"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={bubbleVariants}
          className="absolute bottom-[5rem] left-[1rem] text-[1.75rem] flex items-center justify-center"
        >
          👀
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PresenceBubble;
