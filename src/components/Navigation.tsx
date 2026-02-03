import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAdmin, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const navItems = [
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Events", href: "/events" },
        { label: "Team", href: "/team" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" }
    ];

    const authenticatedNavItems = user ? [
        ...navItems,
        { label: "Dashboard", href: "/dashboard" },
        { label: "Submit Project", href: "/submit-project" }
    ] : navItems;

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className={`pointer-events-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen
                ? 'bg-background/80 backdrop-blur-xl border border-border shadow-2xl shadow-bca-red/5'
                : 'bg-background/60 backdrop-blur-md border border-border/50'
                } rounded-full px-6 py-3 max-w-2xl w-full flex items-center justify-between shadow-lg`}>

                {/* Brand */}
                <Link to="/" className="flex items-center group relative z-50">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
                    {authenticatedNavItems.slice(0, 4).map(item => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="text-muted-foreground hover:text-foreground px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-accent/50"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-foreground hover:text-bca-red hover:bg-accent/50"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Auth Button */}
                    {user ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="text-muted-foreground hover:text-bca-red hover:bg-accent/50"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    ) : (
                        <Link to="/auth">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-bca-red hover:bg-accent/50"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Login
                            </Button>
                        </Link>
                    )}

                    {/* Contact / Right Action */}
                    <Link
                        to="/contact"
                        className="text-muted-foreground hover:text-bca-red flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-accent/50 transition-all text-sm font-medium"
                    >
                        <div className="w-2 h-2 rounded-full bg-bca-red animate-pulse"></div>
                        <span>Contact</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-foreground hover:text-bca-red h-8 w-8"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-foreground hover:text-bca-red h-8 w-8"
                    >
                        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full mt-2 left-4 right-4 bg-popover border border-border rounded-2xl p-4 md:hidden animate-fade-in shadow-2xl pointer-events-auto">
                    <div className="flex flex-col space-y-2">
                        {authenticatedNavItems.map(item => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Button */}
                        <div className="border-t border-border pt-2 mt-2">
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Navigation;
