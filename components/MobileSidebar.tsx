import { Home, Users, FileText, BarChart3, Settings, HelpCircle, ChevronRight, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";

interface MobileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ activeSection, onSectionChange, open, onClose }: MobileSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "families", label: "Gestión de Familias", icon: Users },
    { id: "reports", label: "Reportes", icon: FileText },
    { id: "analytics", label: "Análisis", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[280px] border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground transition-colors"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-sidebar-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-500/50">
                  <Users className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-sidebar-foreground">CIML</h2>
                  <p className="text-xs text-muted-foreground">Gestión Comunitaria</p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-sidebar-foreground">
                <X className="size-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-3 px-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Menú Principal</p>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={cn(
                      "group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xl"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-sidebar-primary opacity-40 blur-xl"></div>
                    )}

                    <div className="relative z-10 flex items-center gap-3">
                      <div className={cn(
                        "rounded-lg p-2 transition-all duration-300",
                        isActive
                          ? "bg-sidebar text-sidebar-primary-foreground ring-1 ring-sidebar-ring"
                          : "bg-muted text-muted-foreground ring-1 ring-transparent group-hover:ring-sidebar-ring"
                      )}>
                        <Icon className="size-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>

                    <ChevronRight className={cn(
                      "relative z-10 size-4 transition-all duration-300",
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Help Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 rounded-xl border border-sidebar-border bg-muted/20 p-4">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                  <HelpCircle className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-sidebar-foreground">¿Necesitás ayuda?</h3>
                  <p className="text-xs text-muted-foreground">Accedé a tutoriales</p>
                </div>
              </div>
              <button className="w-full rounded-lg border border-sidebar-border/60 bg-sidebar-accent px-3 py-2 text-sm text-sidebar-accent-foreground transition-all duration-200 hover:bg-sidebar-accent">
                Centro de ayuda
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
