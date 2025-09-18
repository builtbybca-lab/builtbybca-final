import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const HeroSection = () => {
  const activities = [
    "Coding Contests",
    "Hackathons", 
    "Tech Talks & Seminars",
    "Peer Learning & Mentorship",
    "Career Support",
    "Creative Events",
    "Community Service & Outreach"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-bca-red/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-bca-red/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-bca-red/15 rounded-full blur-xl animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Badge */}
        <div className="inline-flex items-center space-x-2 bg-bca-dark-card/60 backdrop-blur-sm border border-bca-red/30 rounded-full px-6 py-3 mb-8 animate-fade-up">
          <span className="text-2xl">👋</span>
          <span className="text-bca-gray-light">@Builtby.BCA Welcome's You!</span>
        </div>

        {/* Main Logo/Brand */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="text-6xl sm:text-8xl font-black mb-4">
            <span className="text-white">@BUILTBY.</span>
            <br />
            <span className="text-gradient text-glow">BCA</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Learn. Build. Grow.
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-bca-gray-light max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          "The official BCA Student Club Of Adichunchanagiri Institute Of Business Management 
          empowering students through hands-on learning, leadership, and industry exposure."
        </p>

        {/* CTA Button */}
        <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Button className="btn-hero text-lg px-10 py-6 group">
            Join Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Scrolling Activities */}
        <div className="animate-fade-up" style={{ animationDelay: "1s" }}>
          <div className="overflow-hidden bg-bca-dark-card/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex space-x-8 animate-marquee">
              {[...activities, ...activities].map((activity, index) => (
                <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-bca-red" />
                  <span className="text-white font-medium">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-bca-red rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;