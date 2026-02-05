import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, X, Search, Grid, List as ListIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filterEvents = (eventList: Event[]) => {
    return eventList.filter(event => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const upcomingEvents = events.filter(e => e.is_upcoming).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => !e.is_upcoming);

  const EventCard = ({ event }: { event: Event }) => (
    <div
      className="group bg-card/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden hover:border-bca-red/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => setSelectedEvent(event)}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={event.image_url}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-bca-red/90 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
            {event.category}
          </span>
          {event.is_upcoming && (
            <span className="bg-green-500/90 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm animate-pulse">
              Upcoming
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center text-xs text-muted-foreground mb-2 gap-2">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate max-w-[100px]">{event.location}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-bca-red transition-colors line-clamp-2">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="mt-auto">
          <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-bca-red/10 hover:text-bca-red group/btn">
            View Details
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bca-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bca-red"></span>
            </span>
            Discover Our Events
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Events & <span className="text-bca-red">Gallery</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join us for workshops, hackathons, and meetups. Explore our past events and see what's coming next.
          </p>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 h-11 bg-card/50 backdrop-blur border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`h-11 whitespace-nowrap ${selectedCategory === category ? "bg-bca-red hover:bg-bca-red-hover" : ""}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events & Gallery</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="space-y-8 animate-fade-up">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-80 bg-card/30 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filterEvents(upcomingEvents).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filterEvents(upcomingEvents).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/30 rounded-2xl border border-border border-dashed">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We don't have any upcoming events scheduled right now. Check back soon!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="animate-fade-up">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 bg-card/30 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-16">
                  {/* Past Events Grid */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-bca-red" />
                      Past Events
                    </h2>
                    {filterEvents(pastEvents).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filterEvents(pastEvents).map(event => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">No past events found matching your criteria.</p>
                    )}
                  </div>

                  {/* Visual Gallery */}
                  {filterEvents(pastEvents).some(e => e.gallery_images && e.gallery_images.length > 0) && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-bca-red" />
                        Visual Gallery
                      </h2>
                      <PinterestGallery images={filterEvents(pastEvents).flatMap(event => event.gallery_images || [])} />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border mx-2 sm:mx-auto p-0 gap-0">
          {selectedEvent && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="w-full md:w-2/5 relative h-64 md:h-auto">
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white md:hidden"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-bca-red/10 text-bca-red border border-bca-red/20 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedEvent.category}
                  </span>
                  {selectedEvent.is_upcoming && (
                    <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Upcoming
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-col gap-3 text-muted-foreground mb-6 bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-bca-red" />
                    <span className="font-medium text-foreground mr-1">Date:</span>
                    <span>{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(selectedEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-bca-red" />
                    <span className="font-medium text-foreground mr-1">Location:</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-muted-foreground mb-8">
                  <p>{selectedEvent.description}</p>
                </div>

                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-bca-red" />
                      Speakers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEvent.speakers.map((speaker, index) => (
                        <div key={index} className="bg-secondary/30 p-3 rounded-lg border border-border/50 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bca-red/20 flex items-center justify-center text-bca-red font-bold text-xs">
                            {speaker.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-foreground font-medium text-sm">{speaker.name}</p>
                            <p className="text-muted-foreground text-xs">{speaker.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.outcomes && (
                  <div className="mt-auto pt-6 border-t border-border">
                    <h3 className="text-lg font-bold text-foreground mb-2">Key Takeaways</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{selectedEvent.outcomes}</p>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hidden md:flex"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Events;