import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollAnimate } from "@/hooks/useScrollAnimation";
const TestimonialsSection = () => {
  const {
    data: testimonials = []
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('testimonials').select('*').order('display_order', {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  return <section className="py-20 px-4 bg-background">
    <div className="max-w-7xl mx-auto">
      <ScrollAnimate animation="fade" className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Testimonials
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hear from our community members about their experiences
        </p>
      </ScrollAnimate>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No testimonials available yet.</p>
        </div> : testimonials.map((testimonial, index) => <ScrollAnimate key={index} animation="scale" delay={index * 0.1} className="card-glass p-6">
          <div className="flex items-center mb-4">
            {testimonial.avatar_url && <img src={testimonial.avatar_url} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />}
            <div>
              <h3 className="text-foreground font-semibold">{testimonial.name}</h3>
              <p className="text-muted-foreground text-sm">{testimonial.role}</p>
            </div>
          </div>

          <div className="flex mb-3">
            {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-bca-red text-bca-red" />)}
          </div>

          <p className="text-muted-foreground">{testimonial.content}</p>
        </ScrollAnimate>)}
      </div>
    </div>
  </section>;
};
export default TestimonialsSection;