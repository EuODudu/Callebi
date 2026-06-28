import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCallebi } from "@/components/scheduler/Callebi";
import { reactToThemeChange } from "@/lib/scheduler/callebi";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const { speak } = useCallebi();

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const onToggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    speak(reactToThemeChange(next === "dark"));
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="shrink-0 border-amber-800/30 bg-card/80 text-amber-200 hover:bg-amber-950/50 dark:border-amber-700/40"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Clarear (Callebi vai reclamar)" : "Escurecer (ambiente de boteco)"}
    >
      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-600" />}
    </Button>
  );
}
