import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "./motion/MotionWrapper";

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I join Builtby.BCA ?",
      answer: "You can join Builtby.BCA by filling out our membership form. Submit the enrollment form, attend an orientation session, and you'll be part of our community!"
    },
    {
      question: "FAQs for Students",
      answer: "We provide comprehensive support for students including mentorship programs, technical workshops, career guidance, and networking opportunities with industry professionals."
    },
    {
      question: "What's the membership fee?",
      answer: "Membership is completely free for all BCA students. We believe in making quality education and opportunities accessible to everyone."
    },
    {
      question: "Can I participate without being a member?",
      answer: "While some events are open to all students, becoming a member gives you access to exclusive workshops, mentorship programs, and priority registration for special events."
    },
    {
      question: "How are individual roles chosen?",
      answer: "Roles are assigned based on your interests, skills, and commitment level. We conduct interviews and assessments to match members with positions that suit their strengths and career goals."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-24 sm:py-32 relative bg-background overflow-hidden" id="contact">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              HAVE QUESTIONS?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif">
            Frequently Asked <span className="text-bca-red">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about joining, contributing, and participating.
          </p>
        </motion.div>

        {/* FAQ Accordion List with Framer Motion */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                className={`bg-card/90 backdrop-blur-sm border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isOpen
                    ? "border-bca-red/40 shadow-lg shadow-bca-red/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-foreground font-medium text-base sm:text-lg font-serif pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center border border-border/60">
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <Plus className="w-4 h-4 text-bca-red" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1">
                        <p className="text-muted-foreground font-light leading-relaxed text-sm sm:text-base border-t border-border/40 pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;