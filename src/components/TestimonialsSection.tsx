import { Star } from "lucide-react";
const TestimonialsSection = () => {
  const testimonials = [{
    name: "Laura Simons",
    role: "Student",
    rating: 5,
    content: "BCA club provided excellent opportunities for hands-on learning and professional development. The mentorship program was invaluable.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9b6c7a2?w=80&h=80&fit=crop&crop=face"
  }, {
    name: "Preteek Joisker",
    role: "Student",
    rating: 5,
    content: "The coding contests and hackathons organized by BCA club helped me improve my technical skills significantly. Great community!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  }, {
    name: "Emily Dexter",
    role: "Student",
    rating: 5,
    content: "Industry exposure through guest lectures and alumni connections opened up amazing career opportunities for me.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  }, {
    name: "Tony Stark",
    role: "Student",
    rating: 5,
    content: "Leadership opportunities in BCA club helped me develop organizational skills and build confidence in public speaking.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  }, {
    name: "Steve Rogers",
    role: "Student",
    rating: 5,
    content: "The peer learning environment and collaborative projects made learning enjoyable and effective. Highly recommend joining!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
  }, {
    name: "Shreya Advani",
    role: "Student",
    rating: 5,
    content: "BCA club's inclusive culture and diverse events provided me with a well-rounded college experience beyond academics.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
  }];
  
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-glass p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
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