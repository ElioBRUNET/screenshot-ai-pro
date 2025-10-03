import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface TimelineContentProps {
  children: ReactNode;
  animationNum: number;
  timelineRef: React.RefObject<HTMLDivElement>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  customVariants?: any;
}

export const TimelineContent = ({
  children,
  animationNum,
  timelineRef,
  className,
  as: Component = "div",
  customVariants,
}: TimelineContentProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const variants = customVariants || defaultVariants;

  return (
    <motion.div
      ref={ref}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {Component === "div" ? children : <Component className={className}>{children}</Component>}
    </motion.div>
  );
};
