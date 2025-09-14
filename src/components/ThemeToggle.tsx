import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="glass-subtle"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 transition-smooth"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-white/80 drop-shadow-sm" />
      ) : (
        <Moon className="h-4 w-4 text-white/80 drop-shadow-sm" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}