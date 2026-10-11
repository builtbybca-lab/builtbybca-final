import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for image card & ambient glows
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Decorative background grid subtle accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,9,20,0.04),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Staggered Content Reveal */}
          <div className="space-y-8">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-4 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-bca-red animate-pulse" />
                <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                  WHO WE ARE
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif leading-tight"
            >
              Empowering the Next Generation of <span className="text-bca-red">Tech Leaders</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light"
            >
              BuiltBy.BCA is more than just a club; it's a movement. We are a community of passionate developers, designers, and innovators coming together to learn, build, and grow under real-world mentorship.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2"
            >
              <Link to="/about">
                <Button className="font-mono bg-transparent border-2 border-bca-red text-foreground hover:bg-bca-red hover:text-white px-7 py-5 text-sm sm:text-base tracking-wider group transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-bca-red/10">
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Parallax Image Reveal */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-bca-red/10 transition-shadow duration-500 relative group">
              <img
                src="/who-we-are.jpg"
                alt="BuiltBy.BCA Students"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
            </div>

            {/* Parallax Floating Ambient Accent */}
            <motion.div
              style={{ y: glowY }}
              className="absolute -bottom-6 -right-6 w-28 h-28 bg-bca-red/15 rounded-full blur-2xl pointer-events-none"
            />
            <motion.div
              style={{ y: glowY }}
              className="absolute -top-6 -left-6 w-36 h-36 bg-bca-red/10 rounded-full blur-3xl pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
