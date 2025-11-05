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
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in education and research, ensuring our students receive world-class preparation."
  }, {
    icon: Lightbulb,
    title: "Leadership",
    description: "Developing the next generation of tech leaders who will shape the future of technology and society."
  }];
  const stats = [{
    number: "500+",
    label: "Students"
  }, {
    number: "50+",
    label: "Faculty Members"
  }, {
    number: "95%",
    label: "Job Placement Rate"
  }, {
    number: "100+",
    label: "Industry Partners"
  }];
  const team = [{
    name: "Dr. Sarah Johnson",
    role: "Principal",
    image: "/placeholder.svg",
    bio: "Leading educational innovation with 15+ years of experience in STEM education."
  }, {
    name: "Prof. Michael Chen",
    role: "Director of Technology",
    image: "/placeholder.svg",
    bio: "Former Silicon Valley engineer bringing real-world experience to the classroom."
  }, {
    name: "Dr. Emily Rodriguez",
    role: "Head of Innovation Lab",
    image: "/placeholder.svg",
    bio: "Research scientist and entrepreneur fostering student creativity and innovation."
  }, {
    name: "James Wilson",
    role: "Industry Relations Manager",
    image: "/placeholder.svg",
    bio: "Connecting students with leading tech companies and internship opportunities."
  }];
  return <div className="min-h-screen bg-bca-dark">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-bca-red">BCA</span>
            </h1>
            <p className="text-xl text-bca-gray-light max-w-3xl mx-auto">
              Empowering the next generation of innovators, creators, and leaders in technology and beyond.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-bca-red mb-2">{stat.number}</div>
                <div className="text-bca-gray-light">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-bca-gray-light text-lg mb-6">Our mission is to foster a culture of continuous learning, innovation, and collaboration by organizing technical, cultural, and social events that enhance both knowledge and personality. We aim to provide students with real-world exposure, nurture leadership, teamwork, and communication skills, and represent our institution with excellence in inter-collegiate events.</p>
              <p className="text-bca-gray-light text-lg">We aim to provide students with practical exposure, cultivate leadership, teamwork, and communication skills, and uphold our institution’s excellence in inter-collegiate events</p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter rounded-xl overflow-hidden">
                <img src="/placeholder.svg" alt="BCA Campus" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-bca-gray-light text-lg max-w-2xl mx-auto">
              These core values guide everything we do and shape the future leaders we aim to develop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <div key={index} className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center hover:border-bca-red/30 transition-all duration-300">
                <div className="inline-flex p-4 bg-bca-red/20 rounded-xl mb-4">
                  <value.icon className="w-8 h-8 text-bca-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-bca-gray-light">{value.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* History Section */}
      

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Leadership Team</h2>
            <p className="text-bca-gray-light text-lg max-w-2xl mx-auto">
              Meet the dedicated professionals who guide our mission and support our students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => <div key={index} className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-bca-red/30 transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-bca-red text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-bca-gray-light text-sm">{member.bio}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;