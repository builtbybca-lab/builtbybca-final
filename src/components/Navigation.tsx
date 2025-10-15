import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Blog", href: "/blog" },
  ];

  const usecases = [
    { label: "Student Projects", href: "/usecases/student-projects" },
    { label: "Research Work", href: "/usecases/research" },
    { label: "Hackathons", href: "/usecases/hackathons" },
  ];

  const integrations = [
    { label: "API Integration", href: "/integrations/api" },
    { label: "Third-party Tools", href: "/integrations/tools" },
    { label: "Custom Solutions", href: "/integrations/custom" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#0a0a0f]/98 backdrop-blur-md shadow-lg" 
          : "bg-[#0a0a0f]/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="BCA Logo" 
              className="h-9 w-auto transition-transform group-hover:scale-105" 
            />
            <span className="text-white font-semibold text-xl tracking-tight">BCA</span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white/90 hover:text-white text-[15px] font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Usecases Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/90 hover:text-white text-[15px] font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer">
                  Usecases
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1a1a24] border-white/10 z-[100] min-w-[200px]">
                {usecases.map((usecase) => (
                  <DropdownMenuItem key={usecase.label} asChild>
                    <Link 
                      to={usecase.href}
                      className="text-white/90 hover:text-white hover:bg-white/5 cursor-pointer px-3 py-2"
                    >
                      {usecase.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Integrations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/90 hover:text-white text-[15px] font-medium transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer">
                  Integrations
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1a1a24] border-white/10 z-[100] min-w-[200px]">
                {integrations.map((integration) => (
                  <DropdownMenuItem key={integration.label} asChild>
                    <Link 
                      to={integration.href}
                      className="text-white/90 hover:text-white hover:bg-white/5 cursor-pointer px-3 py-2"
                    >
                      {integration.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Cart Icon and Contact Button */}
          <div className="hidden lg:flex items-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white hover:bg-white/5 h-10 w-10"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            
            <Link to="/contact">
              <Button 
                className="bg-white hover:bg-white/90 text-black font-medium px-8 h-11 rounded-full transition-all hover:scale-[1.02] shadow-lg"
              >
                Contact us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-white/80 hover:bg-white/5"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1a1a24]/95 backdrop-blur-md rounded-lg mt-2 border border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-3 rounded-md text-base font-medium block transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Usecases */}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="text-white/60 text-xs px-4 py-1 font-semibold uppercase tracking-wider">
                  Usecases
                </div>
                {usecases.map((usecase) => (
                  <Link
                    key={usecase.label}
                    to={usecase.href}
                    className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-2 rounded-md text-sm block transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {usecase.label}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Integrations */}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="text-white/60 text-xs px-4 py-1 font-semibold uppercase tracking-wider">
                  Integrations
                </div>
                {integrations.map((integration) => (
                  <Link
                    key={integration.label}
                    to={integration.href}
                    className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-2 rounded-md text-sm block transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {integration.label}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Contact Button */}
              <div className="pt-3 px-2">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-white hover:bg-white/90 text-black font-medium h-11 rounded-full">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;