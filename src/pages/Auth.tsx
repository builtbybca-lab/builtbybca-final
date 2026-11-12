import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        toast({
          title: "Welcome!",
          description: "Logged in successfully.",
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();
    const isStudentPasscode = VALID_STUDENT_PASSCODES.includes(enteredPassword);

    try {
      if (isStudentPasscode) {
        // 1. Attempt login with canonical student password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: CANONICAL_STUDENT_PASSWORD,
        });

        if (!signInError && signInData?.session) {
          navigate(redirectTarget);
          return;
        }

        // 2. If login failed, account might be an existing user created with an old custom password.
        // Try invoking sync_student_password RPC to update their password to the centralized passcode.
        try {
          // @ts-expect-error - RPC defined in Supabase
          const { data: synced } = await supabase.rpc("sync_student_password", {
            user_email: trimmedEmail,
            passcode: CANONICAL_STUDENT_PASSWORD,
          });

          if (synced) {
            const { data: retrySyncData, error: retrySyncError } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: CANONICAL_STUDENT_PASSWORD,
            });

            if (!retrySyncError && retrySyncData?.session) {
              navigate(redirectTarget);
              return;
            }
          }
        } catch {
          // Continue to auto-registration if RPC is not present
        }

        // 3. If user does not exist yet, automatically register them
        const autoName = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
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
          if (signUpError.message.toLowerCase().includes("already registered")) {
            throw new Error(
              "Account already exists. If you have a custom password, please use it to log in, or contact council."
            );
          }
          throw signUpError;
        }

        // 4. Try signing in immediately after sign up
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: CANONICAL_STUDENT_PASSWORD,
        });

        if (retryError) {
          if (signUpData?.user && !signUpData.session) {
            toast({
              title: "Verification Email Sent",
              description: "Please check your inbox to confirm your account, then sign in.",
            });
            return;
          }
          throw retryError;
        }

        navigate(redirectTarget);
      } else {
        // Attempt standard login (for admins or custom accounts)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: enteredPassword,
        });

        if (loginError) {
          throw new Error("Invalid email or password. Please verify your credentials and try again.");
        }

        // If this is an existing student (not admin), auto-migrate their password to the centralized passcode
        try {
          if (loginData?.user) {
            const { data: adminRole } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", loginData.user.id)
              .eq("role", "admin")
              .maybeSingle();

            if (!adminRole) {
              await supabase.auth.updateUser({
                password: CANONICAL_STUDENT_PASSWORD,
              });
            }
          }
        } catch {
          // Silently continue if update fails
        }

        navigate(redirectTarget);
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
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

      <section className="pt-24 sm:pt-32 pb-16 px-3.5 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border/80 shadow-2xl p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center tracking-tight">
              Sign In
            </h1>
            <p className="text-muted-foreground text-center text-xs sm:text-sm mb-6">
              Enter your email and password to access your dashboard and resources
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 bg-background border-border text-foreground h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border text-foreground pr-10 h-11"
                    placeholder="••••••••"
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

              <Button
                type="submit"
                className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-11 font-medium transition-all shadow-md mt-2"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;