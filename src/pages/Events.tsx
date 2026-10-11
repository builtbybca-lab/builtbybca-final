import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PinterestGallery } from "@/components/ui/PinterestGallery";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/MotionWrapper";

interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  date: string;
  location: string;
  category: string;
  image_url: string;
  gallery_images: string[];
  speakers: Array<{
    name: string;
    role: string;
  }>;
  outcomes: string;
  is_upcoming: boolean;
  popularity_score: number;
}

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return (data || []).map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        short_description: e.description?.substring(0, 100) || "",
        date: e.date,
        location: e.location || "TBA",
        category: e.event_type,
        image_url: e.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        gallery_images: e.gallery_images || [],
        speakers: [],
        outcomes: "",
        is_upcoming: new Date(e.date) > new Date(),
        popularity_score: 0,
      })) as Event[];
    },
  });

  const categories = ["All", "Hackathon", "Workshop", "Meetup", "Seminar"];
  const filteredEvents = events
    .filter((event) => selectedCategory === "All" || event.category === selectedCategory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-36 sm:pt-40 pb-16 px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.04),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                EVENTS & SESSIONS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 font-serif">
              Event <span className="text-bca-red">Gallery</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Explore hackathons, technical workshops, and community meetups held at BCA@AIBM.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs sm:text-sm rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-bca-red text-white hover:bg-bca-red-hover shadow-md shadow-bca-red/10"
                      : "border-border text-foreground hover:bg-secondary hover:border-bca-red/30"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid mb-4 bg-card/50 rounded-2xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted w-full" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="flex gap-2">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-4 w-1/3 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No events found for this category.</p>
            </div>
          ) : (
            <div className="space-y-20">
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={staggerItemVariants}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group bg-card/90 backdrop-blur-sm border border-border hover:border-bca-red/40 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-bca-red/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-secondary">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-bca-red text-white px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider shadow-sm">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-muted-foreground text-xs font-mono mb-3 space-x-3">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-bca-red" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-bca-red transition-colors font-serif">
                          {event.title}
                        </h3>

                        <p className="text-muted-foreground text-sm font-light mb-6 line-clamp-3 leading-relaxed">
                          {event.short_description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <div className="flex items-center text-bca-red font-mono text-sm font-medium pt-3 border-t border-border/40 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredEvents.some((e) => e.gallery_images && e.gallery_images.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center font-serif">
                    All Event Photos
                  </h2>
                  <PinterestGallery
                    images={filteredEvents.flatMap((event) => event.gallery_images || [])}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border mx-2 sm:mx-auto">
          {selectedEvent && (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  loading="lazy"
                  className="w-full h-48 sm:h-64 object-cover rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-bca-red text-white px-3 py-1 rounded-full text-xs font-mono uppercase font-semibold">
                    {selectedEvent.category}
                  </span>
                  {selectedEvent.is_upcoming && (
                    <span className="bg-foreground text-background px-3 py-1 rounded-full text-xs font-mono uppercase font-semibold">
                      Upcoming
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-serif">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-muted-foreground text-sm font-mono mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-bca-red" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-bca-red" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              {Array.isArray(selectedEvent.speakers) && selectedEvent.speakers.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center font-serif">
                    <Users className="w-5 h-5 mr-2 text-bca-red" />
                    Speakers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedEvent.speakers.map((speaker, index) => (
                      <div
                        key={index}
                        className="bg-secondary/50 p-4 rounded-xl border border-border"
                      >
                        <p className="text-foreground font-semibold">{speaker.name}</p>
                        <p className="text-muted-foreground text-xs font-mono">{speaker.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.outcomes && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 font-serif">Outcomes</h3>
                  <p className="text-muted-foreground font-light">{selectedEvent.outcomes}</p>
                </div>
              )}

              {selectedEvent.gallery_images && selectedEvent.gallery_images.length > 0 && (
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground mb-6 font-serif">
                    Event Gallery
                  </h3>
                  <PinterestGallery images={selectedEvent.gallery_images} />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Events;