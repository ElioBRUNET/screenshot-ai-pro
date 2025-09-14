import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Mail, Lock, User, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email && password && name) {
        const userData = {
          email,
          name,
          profilePicture: profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };
        setUser(userData);
        toast({
          title: "Welcome!",
          description: `Successfully set up your profile, ${name}!`,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Setup incomplete",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Main Container */}
      <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8 glass-main rounded-2xl sm:rounded-3xl"></div>
      
      <div className="relative w-full max-w-md z-10">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white glass-text">Get Started</h1>
          <p className="mt-2 text-white/80 glass-text">
            Set up your AI Implementation Coach profile
          </p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-smooth">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white glass-text">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-subtle border-0 text-white placeholder:text-white/50 glass-text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white glass-text">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass-subtle border-0 text-white placeholder:text-white/50 glass-text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white glass-text">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 glass-subtle border-0 text-white placeholder:text-white/50 glass-text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-picture" className="text-white glass-text">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="glass-subtle border-0 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30 file:backdrop-blur-sm"
                  />
                  <p className="mt-1 text-xs text-white/60 glass-text">
                    Optional: Upload a profile picture or use auto-generated avatar
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm glass-text transition-smooth"
            >
              {isLoading ? "Setting up profile..." : "Complete Setup"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60 glass-text">
              Demo: Use any email, password, and name to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}