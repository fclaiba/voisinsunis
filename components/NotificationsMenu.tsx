"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  CheckCheck,
  Cog,
  Inbox,
  UsersRound,
} from "lucide-react";

import { useNotifications } from "./NotificationsProvider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import type {
  NotificationCategory,
  NotificationItem,
  NotificationPriority,
} from "../types/notification";

const categoryConfig: Record<
  NotificationCategory,
  {
    label: string;
    icon: LucideIcon;
    containerClass: string;
    badgeClass: string;
  }
> = {
  seguimiento: {
    label: "Seguimiento",
    icon: UsersRound,
    containerClass:
      "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    badgeClass:
      "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-transparent",
  },
  reportes: {
    label: "Reportes",
    icon: BarChart3,
    containerClass:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    badgeClass:
      "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-transparent",
  },
  recordatorios: {
    label: "Recordatorio",
    icon: CalendarClock,
    containerClass:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    badgeClass:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-transparent",
  },
  sistema: {
    label: "Sistema",
    icon: Cog,
    containerClass:
      "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    badgeClass:
      "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-transparent",
  },
};

const priorityConfig: Record<
  NotificationPriority,
  { label: string; dotClass: string; badgeClass: string }
> = {
  low: {
    label: "Baja",
    dotClass: "bg-slate-300 dark:bg-slate-500",
    badgeClass: "bg-slate-200 text-slate-600 dark:bg-slate-700/60",
  },
  medium: {
    label: "Media",
    dotClass: "bg-sky-500",
    badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  high: {
    label: "Alta",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  critical: {
    label: "Crítica",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

const MAX_BADGE_COUNT = 9;

function formatTimeAgo(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return "En breve";
  }

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 45) {
    return "Hace instantes";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "Hace 1 minuto" : `Hace ${minutes} minutos`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "Hace 1 hora" : `Hace ${hours} horas`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return weeks === 1 ? "Hace 1 semana" : `Hace ${weeks} semanas`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? "Hace 1 año" : `Hace ${years} años`;
}

export function NotificationsMenu() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    toggleRead,
  } = useNotifications();

  const hasNotifications = notifications.length > 0;
  const displayCount = useMemo(
    () =>
      unreadCount > MAX_BADGE_COUNT
        ? `${MAX_BADGE_COUNT}+`
        : unreadCount.toString(),
    [unreadCount],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group relative rounded-xl transition-all duration-200 hover:bg-muted",
            unreadCount > 0 && "text-primary",
          )}
          aria-label="Abrir centro de notificaciones"
        >
          <Bell className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          {unreadCount > 0 && (
            <>
              <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-1 text-xs font-semibold text-white shadow-lg ring-2 ring-card">
                {displayCount}
              </span>
              <span className="absolute right-1.5 top-1.5 h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[360px] overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-muted/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Notificaciones
            </p>
            <p className="text-xs text-muted-foreground">
              {unreadCount === 0
                ? "No hay pendientes"
                : `${unreadCount} sin leer`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs text-primary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4" />
            Marcar leído
          </Button>
        </div>

        {hasNotifications ? (
          <ScrollArea className="max-h-[420px]">
            <div className="divide-y divide-border/70">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onToggleRead={toggleRead}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-2 px-8 py-12 text-center">
            <Inbox className="size-12 text-muted-foreground/70" />
            <p className="text-sm font-medium text-foreground">
              No hay notificaciones
            </p>
            <p className="text-xs text-muted-foreground">
              Mantente atenta, te avisaremos cuando haya novedades.
            </p>
          </div>
        )}

        <div className="border-t border-border/80 bg-card px-4 py-3">
          <Button
            variant="outline"
            className="w-full border-dashed text-xs font-medium"
          >
            Ver historial completo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationRowProps {
  notification: NotificationItem;
  onToggleRead: (notificationId: string) => void;
}

function NotificationRow({
  notification,
  onToggleRead,
}: NotificationRowProps) {
  const category = categoryConfig[notification.category];
  const priority = priorityConfig[notification.priority];
  const CategoryIcon = category.icon;

  const handleClick = () => {
    onToggleRead(notification.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex w-full gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        notification.read
          ? "bg-card hover:bg-muted/60"
          : "bg-primary/5 hover:bg-primary/10",
      )}
      aria-pressed={!notification.read}
    >
      <div
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors",
          category.containerClass,
        )}
        data-state={notification.read ? "read" : "unread"}
      >
        <CategoryIcon className="size-4" />
        {!notification.read && (
          <span
            className={cn(
              "absolute -right-1 -top-1 size-2.5 rounded-full ring-2 ring-card transition-transform duration-200 group-hover:scale-110",
              priority.dotClass,
            )}
            aria-hidden
          />
        )}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">
            {notification.title}
          </p>
          <span className="whitespace-nowrap text-[11px] text-muted-foreground">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {notification.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge
            variant="secondary"
            className={cn(
              "gap-1 rounded-full px-2 py-1 text-[11px] font-medium",
              category.badgeClass,
            )}
          >
            <CategoryIcon className="size-3.5" />
            {category.label}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent px-2 py-1 text-[11px]",
              priority.badgeClass,
            )}
          >
            {priority.label}
          </Badge>

          {notification.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-dashed px-2 py-1 text-[11px] text-muted-foreground"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/80">
          {notification.read
            ? "Click para marcar como no leído."
            : "Click para marcar como leído."}
        </p>
      </div>
    </button>
  );
}


