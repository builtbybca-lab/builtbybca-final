import { Crown, Code, Building } from "lucide-react";

const WhyJoinSection = () => {
  const reasons = [
    {
      icon: Crown,
      title: "Leadership Opportunities",
      description: "Step into executive roles, lead events, and build your organizational skills.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Code,
      title: "Hands-on Learning", 
      description: "Gain practical skills through coding contests, hackathons, and workshops.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Building,
      title: "Industry Exposure",
      description: "Connect with alumni and industry experts through guest lectures and seminars.",
      gradient: "from-green-500 to-blue-500",
    },
  ];

  return (
    <section className="py-20 relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-bca-red to-transparent w-96"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why Join Us ?
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-bca-red to-transparent w-96"></div>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="card-glass p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon with gradient background */}
              <div className="mb-6 flex justify-center">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${reason.gradient} shadow-lg`}>
                  <reason.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-bca-red transition-colors">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-bca-gray-light leading-relaxed">
                {reason.description}
              </p>

              {/* Decorative Elements */}
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-bca-red rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-bca-red rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-bca-red rounded-full opacity-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;