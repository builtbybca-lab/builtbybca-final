import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TestimonialsSection = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
  
  return (
    <section className="py-20 px-4 bg-bca-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Student <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-bca-gray-light text-lg max-w-2xl mx-auto">
            Hear from our community members about their experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-bca-gray-light">No testimonials available yet.</p>
            </div>
          ) : testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-glass p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                {testimonial.avatar_url && (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-bca-gray-light text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-bca-red text-bca-red" />
                ))}
              </div>
              
              <p className="text-bca-gray-light">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;