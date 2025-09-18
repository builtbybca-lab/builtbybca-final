import { Lightbulb, Users, Rocket, Award, Target, Zap } from "lucide-react";
const WhyJoinSection = () => {
  const reasons = [{
    icon: Lightbulb,
    title: "Innovation Hub",
    description: "Access cutting-edge labs and maker spaces where creativity meets technology to solve real-world challenges.",
    gradient: "from-bca-red/20 to-orange-500/20"
  }, {
    icon: Users,
    title: "Expert Faculty",
    description: "Learn from industry professionals and renowned educators who bring real experience to the classroom.",
    gradient: "from-bca-red/20 to-purple-500/20"
  }, {
    icon: Rocket,
    title: "Launch Your Future",
    description: "Graduate with skills and connections that open doors to top universities and career opportunities.",
    gradient: "from-bca-red/20 to-blue-500/20"
  }, {
    icon: Award,
    title: "Recognition & Awards",
    description: "Join a community of achievers with national recognition in STEM competitions and research.",
    gradient: "from-bca-red/20 to-yellow-500/20"
  }, {
    icon: Target,
    title: "Focused Learning",
    description: "Specialized academies tailored to your interests, from computer science to medical technology.",
    gradient: "from-bca-red/20 to-green-500/20"
  }, {
    icon: Zap,
    title: "Fast-Track Success",
    description: "Accelerated programs and dual enrollment opportunities to get ahead in your chosen field.",
    gradient: "from-bca-red/20 to-cyan-500/20"
  }];
  return <section className="py-20 relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-bca-red to-transparent w-96"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Why Join <span className="text-bca-red">Builtby.BCA?</span>
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-bca-red to-transparent w-96"></div>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => <div key={index} className="p-6 bg-bca-dark-card/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-bca-red/30 transition-all duration-300 group">
              {/* Icon with gradient background */}
              <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${reason.gradient}`}>
                <reason.icon className="w-6 h-6 text-bca-red" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-bca-red transition-colors">
                {reason.title}
              </h3>
              <p className="text-bca-gray-light text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default WhyJoinSection;