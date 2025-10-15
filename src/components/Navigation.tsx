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
    { label: "Use Cases", href: "/#use-cases" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Blog", href: "/blog" },
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
          ? "bg-bca-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg" 
          : "bg-bca-dark/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="BCA Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105" 
              />
              <span className="text-white font-bold text-xl hidden sm:block">BCA</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-bca-red px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Integrations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-bca-red hover:bg-transparent px-4 py-2 text-sm font-medium"
                >
                  Integrations
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-bca-dark-card border-white/10 z-[100]">
                {integrations.map((integration) => (
                  <DropdownMenuItem key={integration.label} asChild>
                    <Link 
                      to={integration.href}
                      className="text-white hover:text-bca-red cursor-pointer"
                    >
                      {integration.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Cart Icon and Contact Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-bca-red hover:bg-white/5"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            
            <Link to="/contact">
              <Button 
                className="bg-bca-red hover:bg-bca-red-light text-white rounded-full px-6 transition-all hover:scale-105 shadow-lg"
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
              className="text-white hover:text-bca-red"
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
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-bca-dark-card/95 backdrop-blur-md rounded-lg mt-2 border border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-white hover:text-bca-red hover:bg-white/5 flex items-center px-3 py-2 rounded-md text-base font-medium block transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Integrations */}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="text-bca-gray-light text-xs px-3 py-1 font-semibold">
                  INTEGRATIONS
                </div>
                {integrations.map((integration) => (
                  <Link
                    key={integration.label}
                    to={integration.href}
                    className="text-white hover:text-bca-red hover:bg-white/5 flex items-center px-3 py-2 rounded-md text-sm block transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {integration.label}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Contact Button */}
              <div className="pt-2 px-3">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-bca-red hover:bg-bca-red-light text-white rounded-full">
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