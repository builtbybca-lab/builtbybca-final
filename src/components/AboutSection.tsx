const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bca-dark via-bca-dark-card to-bca-dark opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop" 
          alt="Coding background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About <span className="text-bca-red">BuiltByBCA</span>
          </h2>
          <div className="w-24 h-1 bg-bca-red mx-auto mb-8"></div>
        </div>

        <div className="card-glass p-8 md:p-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-bca-gray-light text-lg leading-relaxed mb-6">
            <span className="text-white font-semibold">BuiltByBCA</span> is a vibrant student-led tech community at Adichunchanagiri Institute Of Business Management, 
            dedicated to fostering innovation, collaboration, and technical excellence among aspiring developers and tech enthusiasts.
          </p>
          
          <p className="text-bca-gray-light text-lg leading-relaxed mb-6">
            Our mission is to bridge the gap between academic learning and real-world application by providing a platform where students can 
            explore cutting-edge technologies, work on meaningful projects, and develop both technical and soft skills that prepare them for 
            successful careers in the tech industry.
          </p>

          <p className="text-bca-gray-light text-lg leading-relaxed">
            We focus on diverse areas including <span className="text-white font-medium">coding and software development</span>, 
            <span className="text-white font-medium"> artificial intelligence and machine learning</span>, 
            <span className="text-white font-medium"> UI/UX design</span>, and 
            <span className="text-white font-medium"> innovative problem-solving</span>. Through hackathons, workshops, tech talks, 
            and collaborative projects, we empower students to learn by doing, share knowledge, and build a strong foundation for their future in technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
