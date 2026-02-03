import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PinterestGallery } from "@/components/ui/PinterestGallery";
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
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const {
    data: events = [],
    isLoading
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("events").select("*").order("date", {
        ascending: false
      });
      if (error) throw error;
      return (data || []).map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        short_description: e.description?.substring(0, 100) || '',
        date: e.date,
        location: e.location || 'TBA',
        category: e.event_type,
        image_url: e.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        gallery_images: e.gallery_images || [],
        speakers: [],
        outcomes: '',
        is_upcoming: new Date(e.date) > new Date(),
        popularity_score: 0
      })) as Event[];
    }
  });
  const categories = ["All", "Hackathon", "Workshop", "Meetup", "Seminar"];
  const filteredEvents = events.filter(event => selectedCategory === "All" || event.category === selectedCategory).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.popularity_score - a.popularity_score;
  });
  return <div className="min-h-screen bg-background">
    <Navigation />

    <section className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Event <span className="text-bca-red">Gallery</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore moments from our events through this visual gallery.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} onClick={() => setSelectedCategory(category)} className={`${selectedCategory === category ? "bg-bca-red text-white hover:bg-bca-red-hover" : "border-border text-foreground hover:bg-bca-red/20 hover:border-bca-red"}`}>
              {category}
            </Button>)}
          </div>

          <div className="flex gap-2">
            <Button variant={sortBy === "date" ? "default" : "outline"} onClick={() => setSortBy("date")} size="sm" className={`${sortBy === "date" ? "bg-bca-red text-white" : "border-border text-foreground hover:bg-bca-red/20"}`}>Date</Button>
            <Button variant={sortBy === "popularity" ? "default" : "outline"} onClick={() => setSortBy("popularity")} size="sm" className={`${sortBy === "popularity" ? "bg-bca-red text-white" : "border-border text-foreground hover:bg-bca-red/20"}`}>Popular</Button>
          </div>
        </div>
      </div>
    </section>

    <section className="pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-4 bg-card/50 rounded-xl border border-border overflow-hidden animate-pulse"
                style={{ height: `${200 + Math.random() * 300}px` }}
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No events found for this category.</p>
          </div>
        ) : filteredEvents.every(e => !e.gallery_images || e.gallery_images.length === 0) ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground text-lg mb-4">
                No event photos have been uploaded yet.
              </p>
              <p className="text-muted-foreground/70 text-sm">
                Event galleries will appear here once photos are added through the admin panel.
              </p>
            </div>
          </div>
        ) : (
          <PinterestGallery images={filteredEvents.flatMap(event => event.gallery_images || [])} />
        )}
      </div>
    </section>

    <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        {selectedEvent && <div className="space-y-6">
          <div className="relative">
            <img src={selectedEvent.image_url} alt={selectedEvent.title} loading="lazy" className="w-full h-64 object-cover rounded-lg" />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white" onClick={() => setSelectedEvent(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-bca-red text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedEvent.category}
              </span>
              {selectedEvent.is_upcoming && <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Upcoming
              </span>}
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">{selectedEvent.title}</h2>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">{selectedEvent.description}</p>
            </div>
          </div>

          {selectedEvent.speakers && selectedEvent.speakers.length > 0 && <div>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Speakers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedEvent.speakers.map((speaker, index) => <div key={index} className="bg-secondary/50 p-4 rounded-lg border border-border">
                <p className="text-foreground font-semibold">{speaker.name}</p>
                <p className="text-muted-foreground text-sm">{speaker.role}</p>
              </div>)}
            </div>
          </div>}

          {selectedEvent.outcomes && <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Outcomes</h3>
            <p className="text-muted-foreground">{selectedEvent.outcomes}</p>
          </div>}

        </div>}
      </DialogContent>
    </Dialog>

    <Footer />
  </div>;
};
export default Events;