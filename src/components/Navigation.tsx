import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, LogIn, LogOut, User, LayoutDashboard, FolderPlus, Info, FolderKanban, Calendar, Users, BookOpen, Mail, Library } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAdmin, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    const mainNavItems = [
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Events", href: "/events" },
        { label: "Team", href: "/team" },
        { label: "Blog", href: "/blog" },
        { label: "Resources", href: "/resources" },
    ];

    const mobileNavItems = [
        { label: "About", href: "/about", icon: Info },
        { label: "Projects", href: "/projects", icon: FolderKanban },
        { label: "Events", href: "/events", icon: Calendar },
        { label: "Team", href: "/team", icon: Users },
        { label: "Blog", href: "/blog", icon: BookOpen },
        { label: "Resources", href: "/resources", icon: Library },
        { label: "Contact", href: "/contact", icon: Mail },
    ];

    return (
        <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
            <nav className={`pointer-events-auto transition-all duration-500 ${isScrolled || isMobileMenuOpen
                ? 'bg-background/80 backdrop-blur-xl border border-border shadow-2xl shadow-bca-red/5'
                : 'bg-background/60 backdrop-blur-md border border-border/50'
                } rounded-full px-6 py-3 max-w-4xl w-full flex items-center justify-between shadow-lg`}>

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
                    {mainNavItems.map(item => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-accent/50"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-2">
                    <NotificationBell />
                    {/* Theme Toggle */}
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

                    {/* Auth Section */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-bca-red hover:bg-accent/50"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Account
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link to="/dashboard" className="w-full cursor-pointer">
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/submit-project" className="w-full cursor-pointer">
                                        Submit Project
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin" className="w-full cursor-pointer text-bca-red">
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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

                    {/* Contact Button */}
                    <Link
                        to="/contact"
                        className="text-muted-foreground hover:text-emerald-500 flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-accent/50 transition-all text-sm font-medium"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>Contact</span>
                    </Link>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden flex items-center gap-1.5">
                    {/* Direct Quick Dashboard Access for logged in mobile users */}
                    {user ? (
                        <Link to="/dashboard" aria-label="Student Dashboard">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-bca-red hover:bg-bca-red/10 h-8 w-8 rounded-full border border-bca-red/30 shadow-sm"
                                title="Dashboard"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/auth">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-mono h-8 px-2 text-muted-foreground hover:text-bca-red"
                            >
                                <LogIn className="h-3.5 w-3.5 mr-1" />
                                Login
                            </Button>
                        </Link>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-foreground hover:text-bca-red h-8 w-8"
                    >
                        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                <div className="absolute top-full mt-2 left-2 right-2 sm:left-4 sm:right-4 bg-popover border border-border rounded-2xl p-3 sm:p-4 md:hidden animate-fade-in shadow-2xl pointer-events-auto max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="flex flex-col space-y-1.5">
                        {/* Prominent Top Status Banner */}
                        {user ? (
                            <div className="p-3 mb-2 rounded-xl bg-secondary/60 border border-border flex items-center justify-between">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full bg-bca-red/15 border border-bca-red/30 flex items-center justify-center text-bca-red font-mono text-xs font-bold shrink-0">
                                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
                                        <p className="text-[10px] font-mono text-muted-foreground">BCA Student</p>
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-2.5 py-1 bg-bca-red text-white text-xs font-mono font-medium rounded-lg hover:bg-bca-red/90 transition-colors shrink-0"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="p-3 mb-2 rounded-xl bg-bca-red/10 border border-bca-red/20 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-foreground">BCA Student Portal</p>
                                    <p className="text-[10px] text-muted-foreground">Sign in with student passcode</p>
                                </div>
                                <Link
                                    to="/auth"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-3 py-1 bg-bca-red text-white text-xs font-mono font-medium rounded-lg hover:bg-bca-red/90 transition-colors shrink-0"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {/* If user logged in: quick student dashboard links right at top */}
                        {user && (
                            <div className="grid grid-cols-2 gap-1.5 mb-2 pb-2 border-b border-border/60">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-accent/60 hover:bg-accent text-xs font-medium text-foreground transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/submit-project"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-accent/60 hover:bg-accent text-xs font-medium text-foreground transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FolderPlus className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>Submit Work</span>
                                </Link>
                            </div>
                        )}

                        {/* Admin Link for Mobile */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-bca-red hover:bg-bca-red/10 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center border border-bca-red/20 mb-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="w-2 h-2 rounded-full bg-bca-red mr-2.5" />
                                Admin Panel
                            </Link>
                        )}

                        {/* Navigation Links */}
                        {mobileNavItems.map(item => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="w-4 h-4 mr-3 opacity-70" />
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Button */}
                        {user && (
                            <div className="border-t border-border pt-2 mt-2">
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                >
                                    <LogOut className="w-4 h-4 mr-2.5" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;
