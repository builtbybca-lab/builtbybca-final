import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Eye, EyeOff, KeyRound, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

// Centralized student passcodes
const VALID_STUDENT_PASSCODES = [
  "BCAstudent@2026",
  "bcastudent@2026",
  "BuiltByBCA@2026",
  "builtbybca@2026",
  "BCA2026",
  "bca2026",
];
const CANONICAL_STUDENT_PASSWORD = "BCAstudent@2026";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        toast({
          title: "Welcome to BuiltByBCA!",
          description: "Logged in successfully. Redirecting to your dashboard...",
        });
        navigate(redirectTarget);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate(redirectTarget);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTarget, toast]);

  const handleApplyPasscode = () => {
    setPassword(CANONICAL_STUDENT_PASSWORD);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();
    const isStudentPasscode = VALID_STUDENT_PASSCODES.includes(enteredPassword);

    try {
      if (isStudentPasscode) {
        // Attempt login with canonical student password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: CANONICAL_STUDENT_PASSWORD,
        });

        if (!signInError && signInData?.session) {
          navigate(redirectTarget);
          return;
        }

        // If user does not exist yet, automatically register them!
        const autoName = fullName.trim() || trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: CANONICAL_STUDENT_PASSWORD,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTarget}`,
            data: {
              full_name: autoName,
            },
          },
        });

        if (signUpError) {
          if (!signUpError.message.toLowerCase().includes("already registered")) {
            throw signUpError;
          }
        }

        // Try signing in immediately after sign up
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: CANONICAL_STUDENT_PASSWORD,
        });

        if (retryError) {
          if (signUpData?.user && !signUpData.session) {
            toast({
              title: "Verification Email Sent",
              description: "Please check your email inbox to confirm your student account, then sign in.",
            });
            return;
          }
          throw retryError;
        }

        navigate(redirectTarget);
      } else {
        // Attempt standard login (for admins or custom accounts)
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: enteredPassword,
          });

          if (error) {
            throw new Error(
              "Invalid login credentials. If you are a student, please use the official student passcode (BCAstudent@2026)."
            );
          }
          navigate(redirectTarget);
        } else {
          // Normal manual signup
          const { error } = await supabase.auth.signUp({
            email: trimmedEmail,
            password: enteredPassword,
            options: {
              emailRedirectTo: `${window.location.origin}${redirectTarget}`,
              data: {
                full_name: fullName.trim(),
              },
            },
          });

          if (error) throw error;

          toast({
            title: "Success!",
            description: "Account created! Please check your email or sign in with your student passcode.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 md:pt-36 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border/80 shadow-2xl p-6 md:p-8">
            {/* Header Badge */}
            <div className="flex items-center justify-center mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-bca-red/10 text-bca-red border border-bca-red/20">
                <GraduationCap className="w-3.5 h-3.5" />
                Student & Council Access
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center tracking-tight">
              {isLogin ? "Student Login" : "Join BuiltByBCA"}
            </h1>
            <p className="text-muted-foreground text-center text-sm mb-6">
              {isLogin
                ? "Sign in with your email and official student passcode to access the Question Bank and Dashboard."
                : "Create your student account to access club resources."}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName" className="text-foreground text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 bg-background border-border text-foreground h-11"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@gmail.com or student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 bg-background border-border text-foreground h-11"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium">
                    Student Passcode / Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleApplyPasscode}
                    className="text-xs text-bca-red hover:underline font-medium flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    Fill Passcode
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border text-foreground pr-10 h-11"
                    placeholder="Enter BCAstudent@2026"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Passcode helper card */}
              <div className="bg-secondary/40 border border-border/60 rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-bca-red shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Centralized Passcode:</span>{" "}
                  All students can sign in using passcode{" "}
                  <code className="text-bca-red font-mono font-bold bg-bca-red/10 px-1.5 py-0.5 rounded">
                    BCAstudent@2026
                  </code>
                  . New student accounts are created automatically on first login.
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-11 font-medium transition-all shadow-md group"
                disabled={loading}
              >
                {loading ? (
                  "Authenticating..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isLogin ? "Sign In & Access Dashboard" : "Register & Sign In"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center pt-4 border-t border-border/40">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-bca-red transition-colors text-xs font-medium"
              >
                {isLogin
                  ? "Need custom account registration? Click here"
                  : "Have student passcode? Switch to standard login"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;