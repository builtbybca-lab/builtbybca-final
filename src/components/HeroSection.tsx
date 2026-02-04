
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import CircuitBoardBackground from "./CircuitBoardBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background selection:bg-bca-red selection:text-white pt-16 pb-10 sm:py-20">
      {/* Grid Background - Enhanced Visibility & Animation */}
      <div className="absolute inset-0 z-0 bg-grid opacity-40 sm:opacity-80 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none"></div>

      <CircuitBoardBackground />


      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none"></div>




      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center -mt-10 sm:mt-0">



        {/* Main Brand Logo Image */}
        <div className="mb-2 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <img
            src="/logo.png"
            alt="BuiltBy.BCA Logo"
            className="h-36 sm:h-44 md:h-52 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]"
          />
        </div>

        {/* Headline */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 animate-fade-up tracking-tight" style={{ animationDelay: "0.2s" }}>
          Learn.Grow.Lead
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-10 md:mb-16 animate-fade-up font-light leading-relaxed flex flex-col items-center gap-3 sm:gap-4 px-2" style={{ animationDelay: "0.3s" }}>
          <span>The official BCA Student Club Of</span>
          <a
            href="https://aibmckm.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/aibm-logo.png"
              alt="Adichunchanagiri Institute Of Business Management"
              className="h-14 sm:h-16 w-auto object-contain transition-all duration-300"
            />
          </a>
          <span>empowering students through hands-on learning, leadership, and industry exposure.</span>
        </p>



      </div>
    </section >
  );
};

export default HeroSection;