import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Laura Simons",
      role: "Student",
      rating: 5,
      content: "BCA club provided excellent opportunities for hands-on learning and professional development. The mentorship program was invaluable.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9b6c7a2?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Preteek Joisker",
      role: "Student", 
      rating: 5,
      content: "The coding contests and hackathons organized by BCA club helped me improve my technical skills significantly. Great community!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Emily Dexter",
      role: "Student",
      rating: 5, 
      content: "Industry exposure through guest lectures and alumni connections opened up amazing career opportunities for me.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Tony Stark", 
      role: "Student",
      rating: 5,
      content: "Leadership opportunities in BCA club helped me develop organizational skills and build confidence in public speaking.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Steve Rogers",
      role: "Student",
      rating: 5,
      content: "The peer learning environment and collaborative projects made learning enjoyable and effective. Highly recommend joining!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Shreya Advani",
      role: "Student", 
      rating: 5,
      content: "BCA club's inclusive culture and diverse events provided me with a well-rounded college experience beyond academics.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Member & Faculty Testimonials
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-glass p-6 group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-bca-gray-light mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-bca-red/30"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-bca-gray text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;