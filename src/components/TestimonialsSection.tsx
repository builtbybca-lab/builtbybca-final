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
    <section className="py-24 sm:py-32 px-4 bg-secondary/15 relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.02),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20 space-y-4"
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
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Real feedback from community members and student builders about their growth and journey with us.
          </p>
          <div className="pt-2">
            <Link to="/dashboard?tab=testimonial">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:border-bca-red/50 hover:bg-bca-red/10 text-foreground font-mono text-xs rounded-full px-4 h-8 transition-colors"
              >
                <Quote className="w-3.5 h-3.5 mr-1.5 text-bca-red" />
                Share Your Experience
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.length === 0 ? (
            <div className="col-span-full text-center py-16 space-y-4">
              <p className="text-muted-foreground text-base sm:text-lg">No testimonials available yet.</p>
              <Link to="/dashboard?tab=testimonial">
                <Button className="bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground font-mono text-xs rounded-full px-5 h-9 shadow-md">
                  <Quote className="w-3.5 h-3.5 mr-1.5" />
                  Be the First to Share
                </Button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={staggerItemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="bg-card/90 backdrop-blur-sm border border-border hover:border-bca-red/40 rounded-2xl p-6 sm:p-7 transition-colors duration-300 shadow-sm hover:shadow-xl hover:shadow-bca-red/5 relative flex flex-col justify-between group overflow-hidden"
                >
                  {/* Subtle quote watermark */}
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-border/30 group-hover:text-bca-red/10 transition-colors pointer-events-none" />

                  <div>
                    {/* Header: Avatar & Info */}
                    <div className="flex items-center mb-5 relative z-10">
                      {testimonial.avatar_url ? (
                        <OptimizedImage
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          fallbackSrc="/placeholder.svg"
                          containerClassName="w-12 h-12 rounded-full mr-4 shrink-0"
                          className="w-12 h-12 rounded-full object-cover border border-border group-hover:border-bca-red/40 transition-colors"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full mr-4 bg-secondary border border-border flex items-center justify-center font-mono text-sm font-semibold text-bca-red">
                          {testimonial.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-foreground font-semibold text-base group-hover:text-bca-red transition-colors">
                          {testimonial.name}
                        </h3>
                        <p className="text-muted-foreground text-xs font-mono">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex mb-4 space-x-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-bca-red text-bca-red" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground text-sm font-light leading-relaxed relative z-10 italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Corner indicator */}
                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground/50">
                    <span>VERIFIED MEMBER</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-bca-red transition-colors" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;