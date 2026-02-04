import { Users, Target, Award, Lightbulb } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const values = [{
    icon: Target,
    title: "Innovation",
    description: "We foster creativity and encourage students to think outside the box, developing cutting-edge solutions for tomorrow's challenges."
  }, {
    icon: Users,
    title: "Community",
    description: "Building strong connections between students, faculty, and industry professionals to create a supportive learning environment."
  }, {
    icon: Lightbulb,
    title: "Leadership",
    description: "Developing the next generation of tech leaders who will shape the future of technology and society."
  }];

  const team = [{
    name: "Dr. Prakash Rao K S",
    role: "Principal",
    image: "/principal.png",
    bio: "Guiding the institution with visionary leadership and a commitment to academic excellence."
  }, {
    name: "Prof. Kowshalya T P",
    role: "HOD",
    image: "/hod.jpg",
    bio: "Leading the BCA department with dedication to student success and curriculum innovation."
  }];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-bca-red">BCA@AIBM</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering the next generation of innovators, creators, and leaders in technology and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-6">Our mission is to foster a culture of continuous learning, innovation, and collaboration by organizing technical, cultural, and social events that enhance both knowledge and personality. We aim to provide students with real-world exposure, nurture leadership, teamwork, and communication skills, and represent our institution with excellence in inter-collegiate events.</p>
              <p className="text-muted-foreground text-lg">We aim to provide students with practical exposure, cultivate leadership, teamwork, and communication skills, and uphold our institution’s excellence in inter-collegiate events</p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-muted rounded-xl overflow-hidden">
                <img src="/mission.jpg" alt="BCA Campus" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core values guide everything we do and shape the future leaders we aim to develop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 text-center hover:border-bca-red/30 transition-all duration-300">
                <div className="inline-flex p-4 bg-bca-red/20 rounded-xl mb-4">
                  <value.icon className="w-8 h-8 text-bca-red" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet the dedicated professionals who guide our mission and support our students.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div key={index} className="w-full md:w-64 lg:w-72 bg-card/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden hover:border-bca-red/30 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-bca-red/20 to-muted">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-bca-red text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;