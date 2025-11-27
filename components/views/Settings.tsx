import { useEffect, useMemo, useState } from "react";
import { User, Bell, Lock, Shield, Globe, Database, Download, Palette, Monitor, Moon, Sun } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

export function Settings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo(() => {
    if (!mounted) {
      return "system";
    }

    if (theme === "system") {
      return resolvedTheme ?? "system";
    }

    return theme ?? "system";
  }, [mounted, theme, resolvedTheme]);

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-1 text-foreground">Configuración</h2>
        <p className="text-muted-foreground">Administra las preferencias de tu cuenta y del sistema</p>
      </div>

      {/* Profile Section */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <User className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Información del Perfil</h3>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-2xl">
                AR
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card transition-colors shadow-lg hover:bg-muted">
              <User className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <h4 className="mb-1 text-foreground">Ana Rodríguez</h4>
            <p className="mb-3 text-sm text-muted-foreground">Coordinadora Territorial</p>
            <Badge className="bg-emerald-500/15 text-emerald-500">Cuenta activa</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Nombre completo</Label>
            <Input defaultValue="Ana María Rodríguez" className="mt-1.5" />
          </div>
          <div>
            <Label>Rol / Cargo</Label>
            <Input defaultValue="Coordinadora Territorial" className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" defaultValue="ana.rodriguez@territorial.com" className="mt-1.5" />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input defaultValue="+54 9 11 1234-5678" className="mt-1.5" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button variant="outline" className="w-full sm:w-auto">Cancelar</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 w-full sm:w-auto">
            Guardar cambios
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Bell className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Notificaciones</h3>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Notificaciones por email</p>
              <p className="text-sm text-muted-foreground">Recibir alertas de nuevos registros y actualizaciones</p>
            </div>
            <Switch defaultChecked className="sm:ml-4" />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Casos urgentes</p>
              <p className="text-sm text-muted-foreground">Notificación inmediata de situaciones prioritarias</p>
            </div>
            <Switch defaultChecked className="sm:ml-4" />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Reportes semanales</p>
              <p className="text-sm text-muted-foreground">Resumen semanal automático por email</p>
            </div>
            <Switch className="sm:ml-4" />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Recordatorios de visitas</p>
              <p className="text-sm text-muted-foreground">Alertas de seguimientos programados</p>
            </div>
            <Switch defaultChecked className="sm:ml-4" />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Lock className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Seguridad</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Contraseña actual</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <div>
            <Label>Confirmar contraseña</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="size-5 text-white" />
              </div>
              <div>
                <p className="mb-1 font-medium text-foreground">Autenticación de dos factores</p>
                <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad</p>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto sm:ml-4">Activar</Button>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Palette className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Apariencia</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Tema de la interfaz</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = currentTheme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => mounted && setTheme(option.value)}
                    disabled={!mounted}
                    aria-pressed={isActive}
                    className={cn(
                      "w-full rounded-xl border-2 bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !mounted && "cursor-not-allowed opacity-60",
                      isActive ? "border-primary bg-muted" : "border-border hover:border-primary/60",
                    )}
                  >
                    <div className="mb-3 flex items-center justify-center">
                      <Icon
                        className={cn(
                          "size-8",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Zona horaria</Label>
              <Select defaultValue="ar">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">Buenos Aires (GMT-3)</SelectItem>
                  <SelectItem value="ny">New York (GMT-5)</SelectItem>
                  <SelectItem value="ld">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Database className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Datos y Privacidad</h3>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-muted p-4">
            <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 font-medium text-foreground">Exportar datos</p>
                <p className="text-sm text-muted-foreground">Descarga una copia de todos tus datos</p>
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Download className="size-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 font-medium text-foreground">Eliminar cuenta</p>
                <p className="text-sm text-muted-foreground">Elimina permanentemente tu cuenta y todos los datos</p>
              </div>
              <Button variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 sm:w-auto">
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* System Preferences */}
      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Globe className="size-5 text-muted-foreground" />
          <h3 className="text-foreground">Preferencias del Sistema</h3>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Actualizaciones automáticas</p>
              <p className="text-sm text-muted-foreground">Mantener el sistema actualizado automáticamente</p>
            </div>
            <Switch defaultChecked className="sm:ml-4" />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Modo de ahorro de datos</p>
              <p className="text-sm text-muted-foreground">Reduce el consumo de datos en la aplicación</p>
            </div>
            <Switch className="sm:ml-4" />
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Análisis de uso</p>
              <p className="text-sm text-muted-foreground">Ayúdanos a mejorar compartiendo datos de uso anónimos</p>
            </div>
            <Switch defaultChecked className="sm:ml-4" />
          </div>
        </div>
      </Card>

      {/* Version Info */}
      <Card className="border-border bg-gradient-to-br from-muted/60 to-muted/40 p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Voisins Unis</p>
            <p className="text-xs text-muted-foreground">Versión 2.5.1 • Actualizado el 10 de Noviembre 2024</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500">Última versión</Badge>
        </div>
      </Card>
    </div>
  );
}
