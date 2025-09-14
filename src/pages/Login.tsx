import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        if (!name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your full name.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: name
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            setIsSignUp(false);
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your signup."
          });
        }
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password. Please check your credentials.",
              variant: "destructive"
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email not confirmed",
              description: "Please check your email and click the confirmation link.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sign in failed", 
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in."
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Main Container */}
      <div className="absolute inset-1 sm:inset-2 md:inset-3 lg:inset-4 glass-main rounded-2xl sm:rounded-3xl"></div>
      
      <div className={`relative w-full max-w-md z-10 ${isSignUp ? 'px-4 sm:px-6 md:px-8 lg:px-12' : ''}`}>
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          
          <h1 className="text-3xl font-bold glass-text-high-contrast">
            {isSignUp ? "Get Started" : "Welcome Back"}
          </h1>
          <p className="mt-2 glass-text-muted">
            {isSignUp ? "Set up your AI Implementation Coach profile" : "Sign in to your account"}
          </p>
        </div>

        {/* Login Form */}
        <div className={`glass rounded-xl sm:rounded-2xl transition-smooth ${isSignUp ? 'px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-5' : 'px-6 py-4 sm:px-8 sm:py-5'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="glass-text-high-contrast">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="glass-text-high-contrast">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="glass-text-high-contrast">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="glass-text-high-contrast">Profile Avatar</Label>
                  <div className="flex items-center justify-center">
                    <Avatar className="h-16 w-16 border-2 border-border glass-subtle">
                      <AvatarFallback className="glass-text-container glass-text-high-contrast text-xl">
                        {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-center text-xs glass-text-muted">
                    Your avatar will show your initials
                  </p>
                </div>
              </>
            )}

            <Button type="submit" disabled={isLoading} className="w-full glass-text-container glass-text-high-contrast border-0 transition-smooth">
              {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm glass-text-muted">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button 
              type="button"
              variant="ghost"
              className="mt-2 glass-text-high-contrast hover:glass-text-container"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setName("");
              }}
            >
              {isSignUp ? "Sign in instead" : "Sign up here"}
            </Button>
          </div>
        </div>
      </div>
    </div>;
}