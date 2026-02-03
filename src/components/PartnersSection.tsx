const PartnersSection = () => {
  const techCompanies = [
    {
      name: "GeeksforGeeks",
      logo: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png",
      bgColor: "bg-white"
    },
    {
      name: "Google",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      bgColor: "bg-white"
    },
    {
      name: "Microsoft",
      logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
      bgColor: "bg-white"
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      bgColor: "bg-white"
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      bgColor: "bg-white"
    },
    {
      name: "OpenAI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      bgColor: "bg-white"
    },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
      bgColor: "bg-white"
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      bgColor: "bg-white"
    },
    {
      name: "Intel",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
      bgColor: "bg-white"
    },
  ];

  return <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
          Partnering with{" "}
          <span className="text-gradient">Alumni & companies</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Strong connections with alumni and industry partners bring mentorship,
          guest lectures, and career exposure.
        </p>
      </div>

      <div className="mt-16">
        <h3 className="text-center text-lg text-muted-foreground mb-8 font-medium">
          Powered by Global Tech Companies
        </h3>

        <div className="relative overflow-hidden w-full">
          <div className="flex animate-marquee-slow py-4">
            {[...techCompanies, ...techCompanies, ...techCompanies].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 md:mx-16 flex items-center justify-center group"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-10 md:h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-all duration-300 pointer-events-none"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>;
};

export default PartnersSection;