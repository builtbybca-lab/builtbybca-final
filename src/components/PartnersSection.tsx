import { Building2, Users, Award, Target } from "lucide-react";
const PartnersSection = () => {
  // Mock company logos - in real implementation these would be actual logo images
  const partners = [{
    name: "TechCorp",
    icon: Building2
  }, {
    name: "InnovateHub",
    icon: Users
  }, {
    name: "CodeMasters",
    icon: Award
  }, {
    name: "FutureVision",
    icon: Target
  }];
  return <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Partnering with{" "}
            <span className="text-gradient">Alumni & companies</span>
          </h2>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto">
            Strong connections with alumni and industry partners bring mentorship, 
            guest lectures, and career exposure.
          </p>
        </div>

        {/* Partners Grid */}
        

        {/* Infinite Scrolling Partners */}
        <div className="overflow-hidden bg-bca-dark-card/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex space-x-12 animate-marquee-slow">
            {[...partners, ...partners, ...partners].map((partner, index) => <div key={index} className="flex items-center space-x-4 whitespace-nowrap">
                <div className="p-3 bg-bca-red/20 rounded-lg">
                  <partner.icon className="w-6 h-6 text-bca-red" />
                </div>
                <span className="text-white font-medium">{partner.name}</span>
              </div>)}
          </div>
        </div>
      </div>

    </section>;
};
export default PartnersSection;