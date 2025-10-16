import { Code, Palette, Brain, Users, FileText, Mic } from "lucide-react";

const WhatWeDoSection = () => {
  const activities = [
    {
      icon: Code,
      title: "Coding & Development",
      description: "Master programming languages and build real-world applications",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Palette,
      title: "Design",
      description: "Learn UI/UX design principles and create stunning user experiences",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Brain,
      title: "AI Projects",
      description: "Explore machine learning and artificial intelligence innovations",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Users,
      title: "Workshops",
      description: "Hands-on learning sessions with industry experts and mentors",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      icon: FileText,
      title: "Blogging",
      description: "Share knowledge through tech writing and documentation",
      gradient: "from-indigo-500/20 to-blue-500/20",
    },
    {
      icon: Mic,
      title: "Tech Talks",
      description: "Engage with industry leaders and stay updated on latest trends",
      gradient: "from-yellow-500/20 to-amber-500/20",
    },
  ];

  return (
    <section className="py-20 relative" id="what-we-do">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What We <span className="text-bca-red">Do</span>
          </h2>
          <div className="w-24 h-1 bg-bca-red mx-auto mb-6"></div>
          <p className="text-bca-gray-light text-lg max-w-2xl mx-auto">
            Empowering students through diverse learning opportunities and collaborative initiatives
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="card-glass p-8 group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <activity.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-bca-red transition-colors">
                {activity.title}
              </h3>

              {/* Description */}
              <p className="text-bca-gray-light leading-relaxed">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
