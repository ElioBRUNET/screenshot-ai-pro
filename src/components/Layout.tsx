import { Outlet, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, BarChart3, Home, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="glass rounded-2xl p-6 transition-smooth">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-heading text-foreground glass-text">{user?.name || 'User'}</h1>
                  <p className="text-sm text-muted-foreground glass-text">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex items-center space-x-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-smooth glass-text",
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <ThemeToggle />
                <Button
                  variant="glass-subtle"
                  size="sm"
                  onClick={handleLogout}
                  className="h-9 w-9 p-0 transition-smooth"
                >
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
    </div>
  );
}