import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [{
    label: "About",
    href: "/#about"
  }, {
    label: "Projects",
    href: "/#projects"
  }, {
    label: "Events",
    href: "/#events"
  }, {
    label: "Team",
    href: "/#team"
  }, {
    label: "Blog / Updates",
    href: "/#blogs"
  }, {
    label: "Contact / Join",
    href: "/contact"
  }];
  return <nav className="sticky top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Rounded Container with Enhanced Blur */}
        <div className={`bg-[#0a0a0f]/30 backdrop-blur-xl rounded-[32px] border-2 border-white/20 shadow-2xl transition-all duration-300 ${isScrolled ? 'shadow-xl bg-[#0a0a0f]/40' : ''}`}>
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-[72px]">
              {/* Left: Logo and Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Link to="/" className="flex items-center space-x-3 group">
                  <img src="/logo.png" alt="BCA Logo" className="h-20 w-auto transition-transform group-hover:scale-105" />
                  
                </Link>
              </div>

              {/* Center: Desktop Navigation Links */}
              <div className="hidden lg:flex items-center justify-center flex-1 space-x-8 px-8">
                {navItems.map(item => <a key={item.label} href={item.href} className="text-white/90 hover:text-white text-[15px] font-medium transition-colors whitespace-nowrap">
                    {item.label}
                  </a>)}
              </div>

              {/* Right: Join Us Button */}
              <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
                <a href="#contact">
                  <Button className="bg-[#7a0000] hover:bg-[#6a0000] text-white font-medium px-7 h-11 rounded-full transition-all hover:scale-[1.02] shadow-md">
                    Join Us
                  </Button>
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-white/80 hover:bg-white/5 rounded-full">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && <div className="lg:hidden pb-4">
                <div className="pt-2 pb-3 space-y-1">
                  {navItems.map(item => <a key={item.label} href={item.href} className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-3 rounded-lg text-base font-medium block transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.label}
                    </a>)}
                  
                  {/* Mobile Join Us Button */}
                  <div className="pt-4 px-2 border-t border-white/10 mt-3">
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-white font-medium h-11 rounded-full">
                        Join Us
                      </Button>
                    </a>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;