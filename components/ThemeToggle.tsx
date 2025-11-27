"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo(() => {
    if (!mounted) {
      return undefined;
    }

    if (theme === "system") {
      return resolvedTheme ?? "light";
    }

    return theme ?? "light";
  }, [theme, resolvedTheme, mounted]);

  const isDarkMode = currentTheme === "dark";
  const ActiveIcon = isDarkMode ? Moon : Sun;
  const ariaLabel = isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  const handleToggle = () => {
    if (!mounted) {
      return;
    }

    if (isDarkMode) {
      setTheme("light");
      return;
    }

    setTheme("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={ariaLabel}
      className={cn(
        "rounded-full transition-colors",
        mounted ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ActiveIcon className="size-5" />
    </Button>
  );
}


