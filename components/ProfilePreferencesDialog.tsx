"use client";

import {
  BellRing,
  CalendarClock,
  Globe,
  Loader2,
  Palette,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  type ComponentType,
  type InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "../lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { useIsMobile } from "./ui/use-mobile";

export type ThemePreference = "light" | "dark" | "system";

export interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  organization: string;
  location: string;
  bio: string;
  status: string;
  availability: string;
}

export interface PreferenceData {
  language: string;
  timezone: string;
  weeklySummary: boolean;
  productUpdates: boolean;
  smsAlerts: boolean;
  desktopNotifications: boolean;
  autoAssignFamilies: boolean;
  showGuidedTips: boolean;
  themePreference: ThemePreference;
  defaultReportFormat: "pdf" | "xlsx" | "csv";
  dataSharing: boolean;
  digestFrequency: "daily" | "weekly" | "monthly";
}

interface ProfilePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileData;
  preferences: PreferenceData;
  defaultTab?: "profile" | "preferences";
  onSaveProfile: (profile: ProfileData) => void | Promise<void>;
  onSavePreferences: (preferences: PreferenceData) => void | Promise<void>;
  onLogout?: () => void;
}

export function ProfilePreferencesDialog({
  open,
  onOpenChange,
  profile,
  preferences,
  defaultTab = "profile",
  onSaveProfile,
  onSavePreferences,
  onLogout,
}: ProfilePreferencesDialogProps) {
  const isMobile = useIsMobile();
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">(
    defaultTab,
  );

  const [profileDraft, setProfileDraft] = useState<ProfileData>(profile);
  const [preferencesDraft, setPreferencesDraft] =
    useState<PreferenceData>(preferences);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  const [profileFeedback, setProfileFeedback] = useState<string | undefined>();
  const [preferencesFeedback, setPreferencesFeedback] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveTab(defaultTab);
    setProfileDraft(profile);
    setPreferencesDraft(preferences);
    setProfileFeedback(undefined);
    setPreferencesFeedback(undefined);
  }, [open, profile, preferences, defaultTab]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await onSaveProfile(profileDraft);
      setProfileFeedback("Perfil actualizado correctamente.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      await onSavePreferences(preferencesDraft);
      setTheme(preferencesDraft.themePreference);
      setPreferencesFeedback("Preferencias guardadas.");
    } finally {
      setSavingPreferences(false);
    }
  };

  const Container = useMemo(
    () => (isMobile ? Drawer : Dialog),
    [isMobile],
  ) as typeof Drawer | typeof Dialog;

  const Content = (isMobile ? DrawerContent : DialogContent) as typeof DrawerContent;
  const HeaderComponent = (isMobile ? DrawerHeader : DialogHeader) as
    | typeof DrawerHeader
    | typeof DialogHeader;
  const TitleComponent = (isMobile ? DrawerTitle : DialogTitle) as
    | typeof DrawerTitle
    | typeof DialogTitle;
  const DescriptionComponent = (isMobile ? DrawerDescription : DialogDescription) as
    | typeof DrawerDescription
    | typeof DialogDescription;
  const FooterComponent = (isMobile ? DrawerFooter : DialogFooter) as
    | typeof DrawerFooter
    | typeof DialogFooter;

  const ProfileTab = (
    <TabsContent value="profile" className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
              <UserCog className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Información personal
              </p>
              <p className="text-xs text-muted-foreground">
                Datos visibles para el equipo de coordinación.
              </p>
            </div>
          </div>
          <Badge variant="secondary">{profileDraft.status}</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="profile-name"
            label="Nombre completo"
            value={profileDraft.name}
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
          <Field
            id="profile-role"
            label="Rol"
            value={profileDraft.role}
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                role: event.target.value,
              }))
            }
          />
          <Field
            id="profile-email"
            label="Correo electrónico"
            value={profileDraft.email}
            inputMode="email"
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
          <Field
            id="profile-phone"
            label="Teléfono de contacto"
            value={profileDraft.phone}
            inputMode="tel"
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
          />
          <Field
            id="profile-organization"
            label="Organización"
            value={profileDraft.organization}
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                organization: event.target.value,
              }))
            }
          />
          <Field
            id="profile-location"
            label="Ubicación"
            value={profileDraft.location}
            onChange={(event) =>
              setProfileDraft((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
          />
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="profile-availability">Disponibilidad</Label>
            <Textarea
              id="profile-availability"
              value={profileDraft.availability}
              onChange={(event) =>
                setProfileDraft((current) => ({
                  ...current,
                  availability: event.target.value,
                }))
              }
              className="mt-2"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="profile-bio">Descripción breve</Label>
            <Textarea
              id="profile-bio"
              value={profileDraft.bio}
              onChange={(event) =>
                setProfileDraft((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
              className="mt-2"
              rows={4}
              placeholder="Contá en pocas palabras tu experiencia y foco de trabajo."
            />
          </div>
        </div>
      </section>

      <FooterActions
        isSaving={savingProfile}
        feedback={profileFeedback}
        onSave={handleSaveProfile}
        onCancel={() => onOpenChange(false)}
      />
    </TabsContent>
  );

  const PreferencesTab = (
    <TabsContent value="preferences" className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <SectionHeader
          icon={BellRing}
          title="Notificaciones"
          description="Elegí cómo y cuándo querés recibir avisos importantes."
        />
        <ToggleRow
          label="Resúmenes semanales"
          description="Recibir un resumen con los principales indicadores todos los lunes."
          checked={preferencesDraft.weeklySummary}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              weeklySummary: checked,
            }))
          }
        />
        <ToggleRow
          label="Novedades del producto"
          description="Enterate de nuevas funciones y mejoras antes que nadie."
          checked={preferencesDraft.productUpdates}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              productUpdates: checked,
            }))
          }
        />
        <ToggleRow
          label="Alertas SMS"
          description="Recibir mensajes de texto sólo para casos críticos o urgentes."
          checked={preferencesDraft.smsAlerts}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              smsAlerts: checked,
            }))
          }
        />
        <ToggleRow
          label="Notificaciones en escritorio"
          description="Mostrar notificaciones push de nuevas asignaciones y recordatorios."
          checked={preferencesDraft.desktopNotifications}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              desktopNotifications: checked,
            }))
          }
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <SectionHeader
          icon={Globe}
          title="Idioma y zona horaria"
          description="Definí cómo ves fechas y textos en la plataforma."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Idioma"
            value={preferencesDraft.language}
            onValueChange={(value) =>
              setPreferencesDraft((current) => ({
                ...current,
                language: value,
              }))
            }
            options={[
              { value: "es-AR", label: "Español (Argentina)" },
              { value: "es-MX", label: "Español (México)" },
              { value: "pt-BR", label: "Português (Brasil)" },
              { value: "en-US", label: "English (US)" },
            ]}
          />
          <SelectField
            label="Zona horaria"
            value={preferencesDraft.timezone}
            onValueChange={(value) =>
              setPreferencesDraft((current) => ({
                ...current,
                timezone: value,
              }))
            }
            options={[
              {
                value: "America/Argentina/Buenos_Aires",
                label: "(GMT-03:00) Buenos Aires",
              },
              { value: "America/Mexico_City", label: "(GMT-06:00) Ciudad de México" },
              { value: "America/Sao_Paulo", label: "(GMT-03:00) São Paulo" },
              { value: "UTC", label: "(GMT+00:00) UTC" },
            ]}
          />
        </div>
        <SelectField
          label="Frecuencia de resúmenes"
          value={preferencesDraft.digestFrequency}
          onValueChange={(value) =>
            setPreferencesDraft((current) => ({
              ...current,
              digestFrequency: value as PreferenceData["digestFrequency"],
            }))
          }
          icon={CalendarClock}
          options={[
            { value: "daily", label: "Diario" },
            { value: "weekly", label: "Semanal" },
            { value: "monthly", label: "Mensual" },
          ]}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <SectionHeader
          icon={Palette}
          title="Experiencia"
          description="Configurá cómo se comporta la aplicación en tu cuenta."
        />
        <SelectField
          label="Tema preferido"
          value={preferencesDraft.themePreference}
          onValueChange={(value) =>
            setPreferencesDraft((current) => ({
              ...current,
              themePreference: value as ThemePreference,
            }))
          }
          options={[
            { value: "light", label: "Claro" },
            { value: "dark", label: "Oscuro" },
            { value: "system", label: "Seguir al sistema" },
          ]}
        />
        <SelectField
          label="Formato predeterminado de reportes"
          value={preferencesDraft.defaultReportFormat}
          onValueChange={(value) =>
            setPreferencesDraft((current) => ({
              ...current,
              defaultReportFormat: value as PreferenceData["defaultReportFormat"],
            }))
          }
          options={[
            { value: "pdf", label: "PDF" },
            { value: "xlsx", label: "Excel (.xlsx)" },
            { value: "csv", label: "CSV" },
          ]}
        />
        <ToggleRow
          label="Asignación automática de familias"
          description="Permitir que el sistema distribuya nuevas familias según disponibilidad."
          checked={preferencesDraft.autoAssignFamilies}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              autoAssignFamilies: checked,
            }))
          }
        />
        <ToggleRow
          label="Mostrar guías interactivas"
          description="Ver sugerencias contextualizadas para nuevas funciones."
          checked={preferencesDraft.showGuidedTips}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              showGuidedTips: checked,
            }))
          }
        />
        <ToggleRow
          label="Compartir datos de rendimiento"
          description="Autorizar el uso de métricas anónimas para mejorar la plataforma."
          checked={preferencesDraft.dataSharing}
          onCheckedChange={(checked) =>
            setPreferencesDraft((current) => ({
              ...current,
              dataSharing: checked,
            }))
          }
          icon={ShieldCheck}
        />
      </section>

      <FooterActions
        isSaving={savingPreferences}
        feedback={preferencesFeedback}
        onSave={handleSavePreferences}
        onCancel={() => onOpenChange(false)}
      />
    </TabsContent>
  );

  const ContentBody = (
    <Content
      className={cn(
        "max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-0 shadow-xl sm:p-0",
        isMobile ? "h-full rounded-b-none pt-2" : "",
      )}
    >
      <HeaderComponent className="space-y-2 border-b border-border/60 bg-muted/40 px-6 py-5">
        <TitleComponent>Perfil y preferencias</TitleComponent>
        <DescriptionComponent>
          Actualizá tu información personal y la forma de usar la plataforma.
        </DescriptionComponent>
      </HeaderComponent>

      <div className="px-6 py-5">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "preferences")}>
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>
          <div className="mt-5">
            {ProfileTab}
            {PreferencesTab}
          </div>
        </Tabs>
      </div>

      <FooterComponent className="border-t border-border/60 bg-muted/30 px-6 py-4">
        <div className="flex w-full flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div>
            <p>Sesión iniciada como {profile.email}</p>
            <p className="text-xs">
              Última actualización {new Date().toLocaleDateString("es-AR", { dateStyle: "medium" })}
            </p>
          </div>
          {onLogout && (
            <Button variant="outline" onClick={onLogout}>
              Cerrar sesión
            </Button>
          )}
        </div>
      </FooterComponent>
    </Content>
  );

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      {ContentBody}
    </Container>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        {...props}
        className={cn("rounded-lg border border-border bg-card/80", className)}
      />
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ComponentType<{ className?: string }>;
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  icon: Icon,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="flex flex-1 items-start gap-3">
        {Icon ? (
          <div className="mt-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
        ) : null}
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: ComponentType<{ className?: string }>;
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
  icon: Icon,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2">
        {Icon ? (
          <Icon className="size-4 shrink-0 text-muted-foreground" />
        ) : null}
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="border-none bg-transparent px-0 py-0 text-sm">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface FooterActionsProps {
  isSaving: boolean;
  feedback?: string;
  onSave: () => void;
  onCancel: () => void;
}

function FooterActions({
  isSaving,
  feedback,
  onSave,
  onCancel,
}: FooterActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {feedback ? (
        <Alert className="sm:max-w-sm">
          <AlertTitle>Listo</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      ) : (
        <div className="text-xs text-muted-foreground">
          Los cambios se aplican inmediatamente al guardar.
        </div>
      )}
      <div className="flex gap-2 sm:justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cerrar
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span className="ml-2">Guardando...</span>
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}


