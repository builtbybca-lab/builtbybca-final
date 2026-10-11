import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, HTMLMotionProps } from "framer-motion";

// 1. Sleek Global Scroll Progress Bar
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-bca-red via-[#ff2a35] to-bca-red origin-left z-[100] pointer-events-none drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]"
    />
  );
};

// 2. Reusable Scroll Reveal Container
interface FadeInWhenVisibleProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportMargin?: string;
}

export const FadeInWhenVisible: React.FC<FadeInWhenVisibleProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  className = "",
  viewportMargin = "-60px",
  ...rest
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom smooth easeOut cubic
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// 3. Staggered Container & Items for Grids
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: (custom: { delayChildren?: number; staggerChildren?: number } = {}) => ({
    opacity: 1,
    transition: {
      delayChildren: custom.delayChildren || 0.05,
      staggerChildren: custom.staggerChildren || 0.1,
    },
  }),
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
};

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  delayChildren = 0.05,
  staggerChildren = 0.1,
  className = "",
  ...rest
}) => {
  return (
    <motion.div
      variants={staggerContainerVariants}
      custom={{ delayChildren, staggerChildren }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<HTMLMotionProps<"div">> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// 4. Parallax Scroll Wrapper
interface ParallaxItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  speed?: number; // positive moves up faster, negative moves down
  className?: string;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  speed = 40,
  className = "",
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </motion.div>
  );
};
