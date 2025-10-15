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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Rounded Container with Enhanced Blur */}
        <div className={`bg-[#0a0a0f]/70 backdrop-blur-xl rounded-[32px] border-2 border-white/20 shadow-2xl transition-all duration-300 ${
          isScrolled ? 'shadow-xl bg-[#0a0a0f]/80' : ''
        }`}>
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-[72px]">
              {/* Left: Logo and Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Link to="/" className="flex items-center space-x-3 group">
                  <img 
                    src="/logo.png" 
                    alt="BCA Logo" 
                    className="h-8 w-auto transition-transform group-hover:scale-105" 
                  />
                  <span className="text-white font-semibold text-xl tracking-tight">BCA</span>
                </Link>
              </div>

              {/* Center: Desktop Navigation Links */}
              <div className="hidden lg:flex items-center justify-center flex-1 space-x-8 px-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-white/90 hover:text-white text-[15px] font-medium transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Use Cases Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-white/90 hover:text-white text-[15px] font-medium transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer whitespace-nowrap">
                      Use Cases
                      <ChevronDown className="h-3.5 w-3.5" />
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
                    <button className="text-white/90 hover:text-white text-[15px] font-medium transition-colors flex items-center gap-1.5 bg-transparent border-none cursor-pointer whitespace-nowrap">
                      Integrations
                      <ChevronDown className="h-3.5 w-3.5" />
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
              <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:text-white hover:bg-white/5 h-10 w-10 rounded-full"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                
                <Link to="/contact">
                  <Button 
                    className="bg-white hover:bg-white/90 text-black font-medium px-7 h-11 rounded-full transition-all hover:scale-[1.02] shadow-md"
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
                  className="text-white hover:text-white/80 hover:bg-white/5 rounded-full"
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
                <div className="pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-3 rounded-lg text-base font-medium block transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Use Cases */}
                  <div className="border-t border-white/10 pt-3 mt-2">
                    <div className="text-white/60 text-xs px-4 py-2 font-semibold uppercase tracking-wider">
                      Use Cases
                    </div>
                    {usecases.map((usecase) => (
                      <Link
                        key={usecase.label}
                        to={usecase.href}
                        className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-2.5 rounded-lg text-sm block transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {usecase.label}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Integrations */}
                  <div className="border-t border-white/10 pt-3 mt-2">
                    <div className="text-white/60 text-xs px-4 py-2 font-semibold uppercase tracking-wider">
                      Integrations
                    </div>
                    {integrations.map((integration) => (
                      <Link
                        key={integration.label}
                        to={integration.href}
                        className="text-white/90 hover:text-white hover:bg-white/5 flex items-center px-4 py-2.5 rounded-lg text-sm block transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {integration.label}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Contact Button */}
                  <div className="pt-4 px-2 border-t border-white/10 mt-3">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;