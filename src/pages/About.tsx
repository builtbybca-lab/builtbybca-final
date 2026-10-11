import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Lightbulb } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/MotionWrapper";

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description:
        "We foster creativity and encourage students to think outside the box, developing cutting-edge solutions for tomorrow's challenges.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building strong connections between students, faculty, and industry professionals to create a supportive learning environment.",
    },
    {
      icon: Lightbulb,
      title: "Leadership",
      description:
        "Developing the next generation of tech leaders who will shape the future of technology and society.",
    },
  ];

  const team = [
    {
      name: "Dr. Prakash Rao K S",
      role: "Principal",
      image: "/principal.png",
      bio: "Guiding the institution with visionary leadership and a commitment to academic excellence.",
    },
    {
      name: "Prof. Kowshalya T P",
      role: "HOD",
      image: "/hod.jpg",
      bio: "Leading the BCA department with dedication to student success and curriculum innovation.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-36 sm:pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.04),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                OUR IDENTITY
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground font-serif">
              About <span className="text-bca-red">BCA@AIBM</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Empowering the next generation of innovators, creators, and leaders in technology and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-secondary/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3 py-1 rounded-full text-xs font-mono text-bca-red uppercase">
                <span>// MISSION_STATEMENT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif">Our Mission</h2>
              <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
                Our mission is to foster a culture of continuous learning, innovation, and collaboration by organizing technical, cultural, and social events that enhance both knowledge and personality.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
                We aim to provide students with practical exposure, cultivate leadership, teamwork, and communication skills, and uphold our institution’s excellence in inter-collegiate events.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-xl hover:shadow-2xl hover:shadow-bca-red/10 transition-shadow duration-500 group">
                <img
                  src="/mission.jpg"
                  alt="BCA Campus"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                PRINCIPLES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif">Our Values</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
              These core values guide everything we do and shape the future leaders we develop.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/40 p-8 text-center transition-colors duration-300 shadow-sm hover:shadow-xl hover:shadow-bca-red/5 flex flex-col items-center"
              >
                <div className="p-4 bg-secondary/80 border border-border/60 rounded-2xl mb-6 text-bca-red">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{value.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-24 px-4 bg-secondary/15 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                GOVERNANCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif">Leadership Team</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
              Meet the visionary educators who guide our mission and support our students.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-wrap justify-center gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="w-full sm:w-72 lg:w-80 bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/40 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bca-red/5 transition-colors duration-300 group"
              >
                <div className="aspect-square bg-secondary overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1 font-serif group-hover:text-bca-red transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-bca-red text-xs font-mono uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;