import { Search, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsMenu } from "./NotificationsMenu";
import {
  ProfilePreferencesDialog,
  type PreferenceData,
  type ProfileData,
} from "./ProfilePreferencesDialog";

interface HeaderProps {
  onMenuClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

export function Header({
  onMenuClick,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}: HeaderProps) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDialogTab, setProfileDialogTab] =
    useState<"profile" | "preferences">("profile");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Ana Rodríguez",
    role: "Coordinadora",
    email: "ana.rodriguez@territorial.com",
    phone: "+54 11 4567 8901",
    organization: "Voisins Unis",
    location: "Buenos Aires, Argentina",
    bio: "Coordinadora general con experiencia en programas comunitarios y acompañamiento familiar.",
    status: "En línea",
    availability: "Disponible de lunes a viernes de 9 a 18 hs. Coordinación presencial los martes.",
  });
  const [preferencesData, setPreferencesData] = useState<PreferenceData>({
    language: "es-AR",
    timezone: "America/Argentina/Buenos_Aires",
    weeklySummary: true,
    productUpdates: false,
    smsAlerts: false,
    desktopNotifications: true,
    autoAssignFamilies: true,
    showGuidedTips: true,
    themePreference: "system",
    defaultReportFormat: "pdf",
    dataSharing: true,
    digestFrequency: "weekly",
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key !== "k") {
        return;
      }

      event.preventDefault();

      const input = searchInputRef.current;
      if (!input) {
        return;
      }

      input.focus();
      input.select();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const profileInitials = profileData.name
    .split(" ")
    .map((segment) => segment[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleOpenDialog = (tab: "profile" | "preferences" = "profile") => {
    setProfileDialogTab(tab);
    setProfileDialogOpen(true);
  };

  const handleLogout = () => {
    console.info("Cerrar sesión solicitado");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 shadow-sm backdrop-blur transition-colors supports-[backdrop-filter]:bg-card/80">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 md:flex-nowrap md:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-6 text-muted-foreground" />
        </Button>

        {/* Search */}
        <div className="w-full min-w-[220px] max-w-2xl flex-1 md:min-w-[280px]">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") {
                  return;
                }

                event.preventDefault();
                const value = searchInputRef.current?.value ?? "";
                onSearchSubmit?.(value);
              }}
              placeholder="Buscar familias, reportes, análisis..."
              className="rounded-xl border-input bg-muted pl-12 pr-4 py-6 transition-all duration-200 focus:bg-card focus:border-ring focus:ring-4 focus:ring-ring/20"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden xl:block">
              <kbd className="rounded-md border border-border bg-card px-2 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                Ctrl K
              </kbd>
            </div>
          </div>
          
          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="ml-auto md:hidden">
            <Search className="size-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Right section */}
        <div className="ml-0 mt-1 flex w-full items-center justify-end gap-2 md:ml-6 md:mt-0 md:w-auto md:gap-3">
          <ThemeToggle />

          {/* Notifications */}
          <NotificationsMenu />

          {/* Divider - Hidden on mobile */}
          <div className="hidden h-10 w-px bg-border md:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => handleOpenDialog("profile")}
              className="group flex items-center gap-2 rounded-xl px-2 py-2 transition-all duration-200 hover:bg-muted/70 md:gap-3 md:pl-3"
            >
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {profileData.name}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {profileData.status}
                  </Badge>
                  <p className="hidden text-xs text-muted-foreground xl:block">
                    {profileData.role}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Avatar className="h-9 w-9 transition-all duration-200 ring-2 ring-border group-hover:ring-primary/50 md:h-11 md:w-11">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-semibold">
                    {profileInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card md:h-3.5 md:w-3.5"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar - Hidden on mobile */}
      <div className="hidden border-t border-border bg-muted/60 px-4 py-3 md:block md:px-8">
        <div className="flex items-center gap-4 overflow-x-auto text-sm md:gap-8">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Sistema operativo</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="whitespace-nowrap text-muted-foreground">
            Última actualización: <span className="font-semibold text-foreground">hace 2 minutos</span>
          </div>
          <div className="hidden h-4 w-px bg-border lg:block"></div>
          <div className="hidden whitespace-nowrap text-muted-foreground lg:block">
            Registros activos: <span className="font-semibold text-primary">487</span>
          </div>
        </div>
      </div>

      <ProfilePreferencesDialog
        open={profileDialogOpen}
        onOpenChange={(open) => {
          setProfileDialogOpen(open);
          if (!open) {
            setProfileDialogTab("profile");
          }
        }}
        profile={profileData}
        preferences={preferencesData}
        defaultTab={profileDialogTab}
        onSaveProfile={(updatedProfile) => {
          setProfileData(updatedProfile);
        }}
        onSavePreferences={(updatedPreferences) => {
          setPreferencesData(updatedPreferences);
        }}
        onLogout={handleLogout}
      />
    </header>
  );
}