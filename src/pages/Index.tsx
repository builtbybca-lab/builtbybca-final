import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";

import PartnersSection from "@/components/PartnersSection";
import StandoutSection from "@/components/StandoutSection";
import BlogsSection from "@/components/BlogsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen bg-background">
    <Navigation />
    <main>
      <HeroSection />
      <AboutSection />
      <WhatWeDoSection />

      <PartnersSection />

      <BlogsSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
    <Footer />
  </div>;
};
export default Index;