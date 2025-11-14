import { Outlet, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
const navigation = [{
  name: "Dashboard",
  href: "/dashboard",
  icon: Home
}];
export default function Layout() {
  const location = useLocation();
  const {
    userData,
    clearUser
  } = useUser();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await clearUser();
    navigate("/login");
  };
  return <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-background">
        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <div className="clean-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.profilePicture} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userData?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-lg font-heading text-foreground font-medium">{userData?.name || 'User'}</h1>
                    <p className="text-sm text-muted-foreground">{userData?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex items-center space-x-2">
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="h-9 w-9 p-0">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            <Outlet />
          </main>
        </div>
      </div>;
}