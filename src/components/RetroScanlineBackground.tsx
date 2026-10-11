import React from "react";

interface RetroScanlineBackgroundProps {
  className?: string;
}

export const RetroScanlineBackground: React.FC<RetroScanlineBackgroundProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* 1. Base Background: Crisp White/Background in Light, Obsidian in Dark */}
      <div className="absolute inset-0 bg-background dark:bg-[#050505] transition-colors duration-300" />

      {/* 2. Sharp Geometric Grid: Light Mode (Architectural Graph Grid) */}
      <div
        className="absolute inset-0 block dark:hidden opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 2b. Sharp Geometric Grid: Dark Mode (Cyan/White Cyber Matrix) */}
      <div
        className="absolute inset-0 hidden dark:block opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 3. Fine Secondary Red Accent Grid (144px spacing - Dual Mode) */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229, 9, 20, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 9, 20, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "144px 144px",
        }}
      />

      {/* 4. Subtle CRT Scanlines Overlay (Light: Micro Texture, Dark: Classic Scanline) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6) 0px,
            rgba(0, 0, 0, 0.6) 1px,
            transparent 1px,
            transparent 3px
          )`,
          backgroundSize: "100% 3px",
        }}
      />
    </div>
  );
};

export default RetroScanlineBackground;
