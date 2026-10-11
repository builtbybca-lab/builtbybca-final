import React from "react";
import { motion } from "framer-motion";
import { Code, Terminal, Users, Zap } from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "./motion/MotionWrapper";

const WhatWeDoSection: React.FC = () => {
  const features = [
    {
      idx: "01",
      icon: <Terminal className="w-7 h-7 text-bca-red" />,
      title: "Workshops",
      description: "Hands-on sessions on modern tech stacks, frameworks, tooling, and architectures.",
    },
    {
      idx: "02",
      icon: <Code className="w-7 h-7 text-bca-red" />,
      title: "Hackathons",
      description: "Fast-paced coding sprints and problem-solving events to engineer real-world software.",
    },
    {
      idx: "03",
      icon: <Users className="w-7 h-7 text-bca-red" />,
      title: "Mentorship",
      description: "Direct guidance and code reviews from industry alumni and senior builders.",
    },
    {
      idx: "04",
      icon: <Zap className="w-7 h-7 text-bca-red" />,
      title: "Projects",
      description: "Collaborative, open-source building powering community and production tools.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-secondary/20 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(229,9,20,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
            <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
              OUR INITIATIVES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif">
            What We Do
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
            We provide an active launchpad for students to explore, experiment, and excel in modern technology.
          </p>
        </motion.div>

        {/* Feature Cards Stagger Grid */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="bg-card/90 backdrop-blur-sm border border-border hover:border-bca-red/40 rounded-2xl p-6 transition-colors duration-300 shadow-sm hover:shadow-xl hover:shadow-bca-red/5 group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle hover gradient highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-bca-red/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Icon Box */}
                  <div className="bg-secondary/70 group-hover:bg-bca-red/10 border border-border/60 group-hover:border-bca-red/30 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300">
                    {feature.icon}
                  </div>

                  {/* Tech index */}
                  <span className="font-mono text-xs text-muted-foreground/60 tracking-wider font-medium group-hover:text-bca-red transition-colors">
                    // {feature.idx}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2.5 font-serif group-hover:text-bca-red transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom active indicator */}
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase">
                  ACTIVE TRACK
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-bca-red transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
