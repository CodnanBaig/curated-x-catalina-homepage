"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

const SPRING_CONFIG = { stiffness: 120, damping: 24, mass: 0.35 } as const;

/** Detects mobile/tablet layouts so multi-column vertical offsets collapse cleanly when stacked. */
export function useIsCompactViewport(maxWidth = 900) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [maxWidth]);

  return compact;
}

/** Fine scroll-progress bar anchored along the bottom edge of the site header. */
export function ScrollProgressLine({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  if (reduced) return null;

  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{ scaleX, transformOrigin: "0% 50%" }}
    />
  );
}

/**
 * Scroll-linked section wrapper with smooth bi-directional enter and exit choreography.
 * Animates sections smoothly into crisp focus as they arrive and softens them out on departure,
 * reversing seamlessly when the visitor scrolls back up.
 */
export function EditorialSection({
  children,
  id,
  className = "",
  innerClassName = "",
  ariaLabelledBy,
  fullBleed = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
  ariaLabelledBy?: string;
  fullBleed?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, SPRING_CONFIG);

  const opacity = useTransform(smooth, [0, 0.14, 0.86, 1], [0.2, 1, 1, 0.2]);
  const y = useTransform(smooth, [0, 0.16, 0.84, 1], [42, 0, 0, -28]);
  const scale = useTransform(smooth, [0, 0.16, 0.84, 1], [0.975, 1, 1, 0.985]);

  if (fullBleed) {
    return (
      <section ref={ref} id={id} aria-labelledby={ariaLabelledBy} className={className}>
        <motion.div
          className={innerClassName}
          style={reduced ? undefined : { opacity, y, scale }}
        >
          {children}
        </motion.div>
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={className}
      style={reduced ? undefined : { opacity, y, scale }}
    >
      {children}
    </motion.section>
  );
}

/** Bi-directional element reveal that animates in and out cleanly across scroll direction. */
export function RevealBlock({
  children,
  className = "",
  delay = 0,
  distance = 26,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  direction?: "up" | "left" | "right";
}) {
  const reduced = useReducedMotion();
  const compact = useIsCompactViewport();

  const shift = compact ? Math.min(distance, 16) : distance;
  const hiddenOffset =
    direction === "left"
      ? { x: -shift, y: 0 }
      : direction === "right"
        ? { x: shift, y: 0 }
        : { x: 0, y: shift };

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, ...hiddenOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.78, delay, ease: EASE_EDITORIAL }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Framed image with scroll-linked internal vertical parallax and subtle clip-path reveal.
 * Overscales the inner photo automatically based on `depth` so edges never expose the frame.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  depth = 10,
  priority = false,
  objectPosition,
  revealOnMount = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  depth?: number;
  priority?: boolean;
  objectPosition?: string;
  revealOnMount?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, SPRING_CONFIG);

  const y = useTransform(
    smooth,
    [0, 1],
    reduced ? ["0%", "0%"] : [`-${depth}%`, `${depth}%`]
  );
  const imgScale = 1 + depth * 0.024;

  const style: CSSProperties = {
    objectPosition,
    transformOrigin: "center center",
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { clipPath: "inset(8% 4% 8% 4% round 6px)", opacity: 0.7 }}
      {...(revealOnMount
        ? { animate: { clipPath: "inset(0% 0% 0% 0% round 6px)", opacity: 1 } }
        : {
            whileInView: { clipPath: "inset(0% 0% 0% 0% round 6px)", opacity: 1 },
            viewport: { once: false, amount: 0.12 },
          })}
      transition={{ duration: 1.05, ease: EASE_EDITORIAL }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        style={reduced ? style : { ...style, y, scale: imgScale }}
      />
    </motion.div>
  );
}

/** Applies independent vertical scroll parallax to columns or floating editorial cards. */
export function ParallaxShift({
  children,
  className = "",
  offset = [-24, 24],
  desktopOnly = true,
}: {
  children: ReactNode;
  className?: string;
  offset?: [number, number];
  desktopOnly?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const compact = useIsCompactViewport();
  const disabled = reduced || (desktopOnly && compact);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, SPRING_CONFIG);
  const y = useTransform(smooth, [0, 1], disabled ? [0, 0] : offset);

  return (
    <motion.div ref={ref} className={className} style={disabled ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Editorial hairline rule that draws across on entry and recedes smoothly on scroll-out. */
export function HairlineDivider({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={reduced ? false : { scaleX: 0, opacity: 0.25 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
    />
  );
}

/**
 * Scroll-spotlight poetic statement row for "Travel Should Feel Like…".
 * Smoothly illuminates and settles forward as it passes through the reading focal band,
 * dimming gently as it enters or leaves the viewport.
 */
export function PoeticPhrase({
  less,
  more,
}: {
  less: string;
  more: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const compact = useIsCompactViewport();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.08"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });

  const opacity = useTransform(smooth, [0, 0.28, 0.72, 1], [0.24, 1, 1, 0.28]);
  const x = useTransform(
    smooth,
    [0, 0.32, 0.72, 1],
    reduced ? [0, 0, 0, 0] : compact ? [10, 0, 0, -6] : [22, 0, 0, -12]
  );

  return (
    <motion.li
      ref={ref}
      className="feeling-item"
      style={reduced ? undefined : { opacity, x }}
    >
      <span className="feeling-item__less">{less}</span>{" "}
      <em className="feeling-item__more">{more}</em>
    </motion.li>
  );
}
