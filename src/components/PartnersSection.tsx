import React from "react";
import { motion } from "framer-motion";

const PartnersSection: React.FC = () => {
  const techCompanies = [
    {
      name: "Flipkart",
      logo: "/logos/flipkart.png",
      bgColor: "bg-white",
    },
    {
      name: "Google",
      logo: "/logos/google.svg",
      bgColor: "bg-white",
    },
    {
      name: "Microsoft",
      logo: "/logos/microsoft.svg",
      bgColor: "bg-white",
    },
    {
      name: "GeeksforGeeks",
      logo: "/logos/gfg.png",
      bgColor: "bg-white",
    },
    {
      name: "Amazon",
      logo: "/logos/amazon.svg",
      bgColor: "bg-white",
    },
    {
      name: "Meta",
      logo: "/logos/meta.svg",
      bgColor: "bg-white",
    },
    {
      name: "Netflix",
      logo: "/logos/netflix.svg",
      bgColor: "bg-white",
    },
    {
      name: "Spotify",
      logo: "/logos/spotify.svg",
      bgColor: "bg-white",
    },
  ];

  return (
    <section className="py-24 sm:py-28 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
            <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
              ECOSYSTEM & NETWORK
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif">
            Partnering with <span className="text-bca-red">Alumni & Industry</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Strong connections with alumni and industry leaders bring high-impact mentorship, technical masterclasses, and career pathways.
          </p>
        </motion.div>

        {/* Marquee with smooth gradient masks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8"
        >
          <div className="relative overflow-hidden w-full py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-marquee-slow hover:[animation-play-state:paused] py-3 items-center">
              {[...techCompanies, ...techCompanies, ...techCompanies].map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-4 md:mx-6 flex items-center justify-center group/logo transition-transform duration-300 hover:scale-105"
                >
                  {/* Clean white pill card ensuring 100% original full colors with high contrast in both light and dark modes */}
                  <div className="bg-white rounded-xl px-5 py-2.5 flex items-center justify-center shadow-md shadow-black/5 border border-border/40 hover:border-bca-red/40 transition-all duration-300 h-13 md:h-14 min-w-[130px]">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={140}
                      height={40}
                      className="h-7 md:h-8 w-auto max-w-[120px] object-contain pointer-events-none select-none transition-transform duration-300 group-hover/logo:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;