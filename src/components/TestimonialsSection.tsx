import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "./motion/MotionWrapper";

const TestimonialsSection: React.FC = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-20 sm:py-28 px-4 bg-secondary/15 relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.02),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Minimal Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16 space-y-3"
        >
          <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
            <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
              COMMUNITY VOICES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif">
            Student <span className="text-bca-red">Testimonials</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Real feedback from community members and student builders about their growth and journey with us.
          </p>
        </motion.div>

        {/* Testimonials Grid or Minimal Empty State */}
        {testimonials.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-10 px-6 rounded-2xl border border-dashed border-border/80 bg-card/40 backdrop-blur-sm space-y-3.5">
            <div className="w-9 h-9 rounded-full bg-secondary/80 border border-border flex items-center justify-center mx-auto text-bca-red">
              <Quote className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              No testimonials available yet. Be the first to share your experience with the community.
            </p>
            <div className="pt-1">
              <Link to="/dashboard?tab=testimonial">
                <Button
                  size="sm"
                  className="bg-bca-red hover:bg-bca-red/90 text-white font-mono text-xs rounded-full px-5 h-8.5 shadow-sm transition-all"
                >
                  Share Your Experience
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={staggerItemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                  className="bg-card/90 backdrop-blur-sm border border-border hover:border-bca-red/40 rounded-2xl p-6 transition-colors duration-300 shadow-sm hover:shadow-xl hover:shadow-bca-red/5 relative flex flex-col justify-between group overflow-hidden"
                >
                  <Quote className="absolute top-4 right-4 w-10 h-10 text-border/20 group-hover:text-bca-red/10 transition-colors pointer-events-none" />

                  <div>
                    {/* Header: Avatar & Info */}
                    <div className="flex items-center mb-4 relative z-10">
                      {testimonial.avatar_url ? (
                        <OptimizedImage
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          fallbackSrc="/placeholder.svg"
                          containerClassName="w-11 h-11 rounded-full mr-3.5 shrink-0"
                          className="w-11 h-11 rounded-full object-cover border border-border group-hover:border-bca-red/40 transition-colors"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full mr-3.5 bg-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-bca-red shrink-0">
                          {testimonial.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-foreground font-semibold text-sm group-hover:text-bca-red transition-colors">
                          {testimonial.name}
                        </h3>
                        <p className="text-muted-foreground text-[11px] font-mono">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex mb-3 space-x-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-bca-red text-bca-red" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground text-xs sm:text-sm font-light leading-relaxed relative z-10 italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Corner indicator */}
                  <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground/50">
                    <span>VERIFIED MEMBER</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-bca-red transition-colors" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Minimal footer action */}
            <div className="text-center pt-8">
              <Link
                to="/dashboard?tab=testimonial"
                className="inline-flex items-center text-xs font-mono text-muted-foreground hover:text-bca-red transition-colors gap-1"
              >
                <span>Share your experience with BuiltByBCA</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
