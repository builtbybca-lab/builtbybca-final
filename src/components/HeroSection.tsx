import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
const HeroSection = () => {
  const activities = ["Coding Contests", "Hackathons", "Tech Talks & Seminars", "Peer Learning & Mentorship", "Career Support", "Creative Events", "Community Service & Outreach"];
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-bca-red/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-bca-red/10 rounded-full blur-xl animate-float" style={{
        animationDelay: "2s"
      }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-bca-red/15 rounded-full blur-xl animate-float" style={{
        animationDelay: "4s"
      }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Badge */}
        <div className="inline-flex items-center space-x-2 bg-bca-dark-card/60 backdrop-blur-sm border border-bca-red/30 rounded-full px-6 py-3 mb-8 animate-fade-up">
          <span className="text-2xl">👋</span>
          <span className="text-bca-gray-light">@Builtby.BCA Welcome's You!</span>
        </div>

        {/* Main Logo/Brand */}
        <div className="mb-8 animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
          
        </div>

        {/* Main Headline */}
        <h1 style={{
        animationDelay: "0.4s"
      }} className="text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-up lg:text-7xl">
          BuiltByBCA
        </h1>

        {/* Tagline */}
        <p style={{
        animationDelay: "0.5s"
      }} className="text-2xl sm:text-3xl font-semibold text-bca-red mb-4 animate-fade-up">
          A student tech club for creating, learning & building together
        </p>

        {/* Subtitle */}
        <p style={{
        animationDelay: "0.6s"
      }} className="text-lg text-bca-gray-light max-w-3xl mx-auto mb-12 animate-fade-up">
          The official BCA Student Club of Adichunchanagiri Institute Of Business Management 
          empowering students through hands-on learning, leadership, and industry exposure.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-up" style={{
        animationDelay: "0.8s"
      }}>
          <Button className="bg-[#7a0000] hover:bg-[#6a0000] text-white text-lg px-10 py-6 group">
            Join Us
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" className="border-2 border-[#7a0000] text-white hover:bg-[#7a0000] hover:text-white text-lg px-10 py-6">
            Become a Member
          </Button>
          <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6">
            Explore Projects
          </Button>
        </div>

        {/* Scrolling Activities */}
        <div className="animate-fade-up" style={{
        animationDelay: "1s"
      }}>
          <div className="overflow-hidden bg-bca-dark-card/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex space-x-8 animate-marquee">
              {[...activities, ...activities].map((activity, index) => <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-bca-red" />
                  <span className="text-white font-medium">{activity}</span>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        
      </div>

    </section>;
};
export default HeroSection;