import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RetroScanlineBackground from "./RetroScanlineBackground";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax Scroll Tracking (0 = at top, 1 = scrolled out of view)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Layer 1: Background grid moves slowly down for deep parallax perspective
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  // Layer 2: Central Logo & Content cluster moves with smooth parallax & fades
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // Layer 3: HUD Coordinates shift subtly upward and fade out faster
  const hudY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const hudOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Layer 4: Minimal Scroll Indicator fades out promptly on scroll
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground selection:bg-bca-red selection:text-white pt-24 pb-14 sm:py-20"
    >
      {/* 1. Parallax Layer: Retro Scanline & Geometric Grid Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <RetroScanlineBackground />
      </motion.div>

      {/* 2. Parallax Layer: Top Corner Technical Coordinates */}
      <motion.div
        style={{ y: hudY, opacity: hudOpacity }}
        className="hidden md:flex absolute top-20 sm:top-24 left-6 sm:left-10 lg:left-14 font-mono text-[10px] sm:text-xs text-muted-foreground/80 tracking-wider select-none flex-col gap-1 pointer-events-none z-20"
      >
        <span>LOC // 13°19'N 75°46'E</span>
        <span className="text-bca-red font-bold">NODE // CHIKKAMAGALURU</span>
      </motion.div>

      <motion.div
        style={{ y: hudY, opacity: hudOpacity }}
        className="hidden md:flex absolute top-20 sm:top-24 right-6 sm:right-10 lg:right-14 font-mono text-[10px] sm:text-xs text-muted-foreground/80 tracking-wider select-none flex-col gap-1 text-right pointer-events-none z-20"
      >
        <span>EST // 2025</span>
        <span className="text-muted-foreground font-medium">STATUS // ACTIVE COHORT</span>
      </motion.div>

      {/* 3. Corner Framing Crosshairs */}
      <motion.span
        style={{ opacity: hudOpacity }}
        className="hidden lg:block absolute bottom-10 left-10 font-mono text-[11px] text-muted-foreground/40 select-none pointer-events-none"
      >
        + [BCA_TERMINAL]
      </motion.span>
      <motion.span
        style={{ opacity: hudOpacity }}
        className="hidden lg:block absolute bottom-10 right-10 font-mono text-[11px] text-muted-foreground/40 select-none pointer-events-none"
      >
        [END_FRAME] +
      </motion.span>

      {/* 4. Parallax Layer: Main Hero Content Lockup */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
      >
        {/* Mobile Technical Coordinates (Below navbar pill) */}
        <div className="flex md:hidden items-center justify-center gap-2 font-mono text-[9px] text-muted-foreground/75 tracking-wider mb-4 select-none">
          <span>13°19'N 75°46'E</span>
          <span className="text-bca-red font-bold">•</span>
          <span className="text-bca-red font-bold">CHIKKAMAGALURU</span>
        </div>

        {/* BUILTBY.BCA BRAND LOGO (Centered, Free-Floating & Pixelated) */}
        <div className="relative flex items-center justify-center my-2 select-none">
          <img
            src="/logo.png"
            alt="BuiltBy.BCA Logo"
            width={400}
            height={400}
            // @ts-expect-error - fetchPriority standard in HTML5
            fetchPriority="high"
            style={{ imageRendering: "pixelated" }}
            className="relative z-10 h-36 sm:h-48 md:h-56 lg:h-64 w-auto object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_25px_rgba(229,9,20,0.45)] pointer-events-none"
          />
        </div>

        {/* AFFILIATION & MISSION TEXT (Comfortably spaced beneath logo) */}
        <div className="flex flex-col items-center gap-2 sm:gap-2.5 max-w-xl mx-auto mt-6 sm:mt-8">
          {/* Minimal Tagline Headline (No bold) */}
          <p className="text-sm sm:text-base md:text-lg font-normal tracking-wider text-muted-foreground">
            Learn <span className="text-bca-red font-light">•</span> Grow <span className="text-bca-red font-light">•</span> Lead
          </p>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-lg mx-auto px-2">
            Empowering students through hands-on learning, leadership, and industry exposure.
          </p>
        </div>
      </motion.div>

      {/* 5. Minimalist Animated Scroll Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 select-none pointer-events-none z-20"
      >
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">
          SCROLL
        </span>
        <div className="w-3.5 h-6 rounded-full border border-muted-foreground/30 flex items-start justify-center p-0.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-bca-red"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;