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
                <div className="absolute top-full mt-2 left-2 right-2 sm:left-4 sm:right-4 bg-popover border border-border rounded-2xl p-3 sm:p-4 md:hidden animate-fade-in shadow-2xl pointer-events-auto max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="flex flex-col space-y-2">
                        {mobileNavItems.map(item => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px] flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}

                        {/* Admin Link for Mobile */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-bca-red hover:text-bca-red-hover hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px] flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Admin Panel
                            </Link>
                        )}

                        {/* User Account Links for Mobile */}
                        {user && (
                            <div className="border-t border-border pt-2 mt-2">
                                <p className="text-xs text-muted-foreground px-4 py-2 uppercase tracking-wider">Account</p>
                                <Link
                                    to="/dashboard"
                                    className="text-foreground hover:text-bca-red hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px] flex items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-5 h-5 mr-3" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/submit-project"
                                    className="text-foreground hover:text-bca-red hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px] flex items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FolderPlus className="w-5 h-5 mr-3" />
                                    Submit Project
                                </Link>
                            </div>
                        )}

                        {/* Mobile Auth Button */}
                        <div className="border-t border-border pt-2 mt-2">
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px]"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent px-4 py-4 rounded-xl text-base font-medium transition-all min-h-[48px]"
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
