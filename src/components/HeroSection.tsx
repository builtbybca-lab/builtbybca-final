import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background selection:bg-bca-red selection:text-white pt-20">
      {/* Grid Background - Enhanced Visibility & Animation */}
      <div className="absolute inset-0 z-0 bg-grid opacity-50 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">



        {/* Main Brand Logo Image */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <img
            src="/logo.png"
            alt="BuiltBy.BCA Logo"
            className="h-32 md:h-48 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]"
          />
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-8 animate-fade-up tracking-tight" style={{ animationDelay: "0.2s" }}>
          Learn.Grow.Lead
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16 animate-fade-up font-light leading-relaxed" style={{ animationDelay: "0.3s" }}>
          "The official BCA Student Club Of Adichunchanagiri Institute Of Business Management
          empowering students through hands-on learning, leadership, and industry exposure."
        </p>



      </div>
    </section>
  );
};

export default HeroSection;