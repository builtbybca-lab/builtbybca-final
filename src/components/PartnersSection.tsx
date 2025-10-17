const PartnersSection = () => {
  const techCompanies = [
    { name: "Google", color: "text-blue-500", glow: "shadow-blue-500/50" },
    { name: "Microsoft", color: "text-sky-400", glow: "shadow-sky-400/50" },
    { name: "Apple", color: "text-gray-300", glow: "shadow-gray-300/50" },
    { name: "Amazon", color: "text-orange-400", glow: "shadow-orange-400/50" },
    { name: "Meta", color: "text-blue-400", glow: "shadow-blue-400/50" },
    { name: "OpenAI", color: "text-emerald-400", glow: "shadow-emerald-400/50" },
    { name: "Tesla", color: "text-red-500", glow: "shadow-red-500/50" },
    { name: "IBM", color: "text-blue-600", glow: "shadow-blue-600/50" },
    { name: "Intel", color: "text-blue-500", glow: "shadow-blue-500/50" },
  ];

  return <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="mt-16">
          <h3 className="text-center text-lg text-bca-gray-light mb-8 font-medium">
            Powered by Global Tech Innovators
          </h3>

          <div className="relative overflow-hidden bg-transparent rounded-2xl py-8">
            <div className="absolute inset-0 bg-gradient-to-r from-bca-dark via-transparent to-bca-dark z-10 pointer-events-none"></div>

            <div className="flex animate-marquee-slow">
              {[...techCompanies, ...techCompanies, ...techCompanies].map((company, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 mx-8 px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10
                    hover:border-white/30 hover:shadow-lg transition-all duration-300 hover:scale-105 ${company.glow}`}
                >
                  <span className={`text-2xl font-bold ${company.color} whitespace-nowrap drop-shadow-lg`}>
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default PartnersSection;