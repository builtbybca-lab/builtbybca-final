import { Users, Calendar, Heart, Award } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "110",
      label: "Club Members",
      suffix: "+",
    },
    {
      icon: Calendar,
      number: "10",
      label: "Events / Year", 
      suffix: "+",
    },
    {
      icon: Heart,
      number: "12",
      label: "Community Initiatives",
      suffix: "+",
    },
    {
      icon: Award,
      number: "14",
      label: "Seminars/year",
      suffix: "+",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card-stat text-center group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-bca-red/20 rounded-full group-hover:bg-bca-red/30 transition-colors">
                  <stat.icon className="w-8 h-8 text-bca-red" />
                </div>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                <span className="text-gradient">{stat.number}</span>
                <span className="text-bca-red">{stat.suffix}</span>
              </div>
              <p className="text-bca-gray-light font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;