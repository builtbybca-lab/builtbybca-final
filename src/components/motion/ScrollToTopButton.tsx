import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 group flex items-center justify-center w-11 h-11 rounded-full bg-background/90 dark:bg-card/90 backdrop-blur-md border border-border shadow-lg shadow-black/10 dark:shadow-bca-red/10 text-foreground hover:text-white hover:bg-bca-red hover:border-bca-red transition-colors focus:outline-none focus:ring-2 focus:ring-bca-red/50"
        >
          {/* Circular progress SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
            <circle
              cx="20"
              cy="20"
              r="17"
              className="text-border/40 stroke-current"
              strokeWidth="2"
              fill="transparent"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="17"
              className="text-bca-red group-hover:text-white stroke-current transition-colors"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="106.8"
              style={{
                pathLength: scrollYProgress,
              }}
            />
          </svg>

          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
