import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import {
    Menu,
    X,
    Sun,
    Moon,
    User,
    LogOut,
    LogIn,
    LayoutDashboard,
    FolderPlus,
    BookOpen,
    Calendar,
    Users,
    FolderKanban,
    Library,
    Mail,
    Info,
} from "lucide-react";
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

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
    };

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

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

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
        <>
            {/* Backdrop Dimmer for Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-2.5 sm:px-4 pointer-events-none">
                <nav
                    className={`pointer-events-auto transition-all duration-300 ${
                        isScrolled || isMobileMenuOpen
                            ? "bg-background/90 backdrop-blur-xl border border-border shadow-2xl shadow-bca-red/5"
                            : "bg-background/70 backdrop-blur-md border border-border/60"
                    } rounded-full px-3.5 py-2 sm:px-6 sm:py-3 max-w-4xl w-full flex items-center justify-between shadow-lg`}
                >
                    {/* Brand */}
                    <Link to="/" className="flex items-center group relative z-50 shrink-0">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-accent/50"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NotificationBell />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-foreground hover:text-bca-red hover:bg-accent/50"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

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

                        <Link
                            to="/contact"
                            className="text-muted-foreground hover:text-emerald-500 flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-accent/50 transition-all text-sm font-medium"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>Contact</span>
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-1 sm:gap-1.5">
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
                                    className="text-xs font-medium h-8 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <LogIn className="h-3.5 w-3.5 mr-1 text-bca-red" />
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-foreground hover:text-bca-red h-8 w-8 rounded-full"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground hover:text-bca-red h-8 w-8 rounded-full"
                            aria-label="Toggle Navigation Menu"
                        >
                            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </div>
                </nav>

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full mt-2.5 left-2.5 right-2.5 sm:left-4 sm:right-4 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl p-4 md:hidden animate-fade-in shadow-2xl pointer-events-auto max-h-[calc(100vh-95px)] overflow-y-auto z-50">
                        <div className="flex flex-col space-y-2">
                            {/* Profile or Sign-in Box */}
                            {user ? (
                                <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <div className="w-9 h-9 rounded-full bg-bca-red/15 border border-bca-red/30 flex items-center justify-center text-bca-red font-mono text-xs font-bold shrink-0">
                                            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-semibold text-foreground truncate">{user.email}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {isAdmin ? "Council Admin" : "BCA Student"}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-3 py-1.5 bg-[#7a0000] text-white text-xs font-medium rounded-lg hover:bg-[#6a0000] transition-colors shrink-0"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-secondary/50 border border-border/80 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Student Portal</p>
                                        <p className="text-[10px] text-muted-foreground">Access question bank & dashboard</p>
                                    </div>
                                    <Link
                                        to="/auth"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-3.5 py-1.5 bg-[#7a0000] text-white text-xs font-medium rounded-lg hover:bg-[#6a0000] transition-colors shrink-0 shadow-sm"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Quick Action Tiles */}
                            {user && (
                                <div className="grid grid-cols-2 gap-2 pb-1 border-b border-border/60">
                                    <Link
                                        to="/submit-project"
                                        className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-all border border-border/50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FolderPlus className="w-4 h-4 text-bca-red shrink-0" />
                                        <span>Submit Project</span>
                                    </Link>
                                    <Link
                                        to="/resources#question-bank"
                                        className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-all border border-border/50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Library className="w-4 h-4 text-bca-red shrink-0" />
                                        <span>Question Bank</span>
                                    </Link>
                                </div>
                            )}

                            {/* Admin Panel Link */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-bca-red hover:bg-bca-red/10 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center border border-bca-red/25"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="w-2 h-2 rounded-full bg-bca-red mr-2.5" />
                                    Admin Panel
                                </Link>
                            )}

                            {/* Navigation Links with comfortable touch spacing */}
                            <div className="space-y-0.5 pt-1">
                                {mobileNavItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.href}
                                        className="text-foreground/80 hover:text-foreground hover:bg-accent/60 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-4 h-4 mr-3 text-muted-foreground" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Sign Out Button */}
                            {user && (
                                <div className="border-t border-border/60 pt-2 mt-1">
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center text-muted-foreground hover:text-bca-red hover:bg-accent/60 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                                    >
                                        <LogOut className="w-4 h-4 mr-2.5" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Navigation;
