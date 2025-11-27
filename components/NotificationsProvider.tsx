"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  NewNotificationInput,
  NotificationItem,
} from "../types/notification";

interface NotificationsContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  latestNotification: NotificationItem | null;
  addNotification: (notification: NewNotificationInput) => string;
  markAsRead: (notificationId: string) => void;
  markAsUnread: (notificationId: string) => void;
  toggleRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined,
);

const createNotificationId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `notif-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};

const sortNotifications = (items: NotificationItem[]) => {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

const defaultNotifications: NotificationItem[] = sortNotifications([
  {
    id: "notif-1",
    title: "Caso prioritario en Villa Esperanza",
    description:
      "Se registró una situación crítica para la familia González. Requiere visita dentro de las próximas 24 horas.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    priority: "critical",
    category: "seguimiento",
    tags: ["Villa Esperanza", "Visita"],
  },
  {
    id: "notif-2",
    title: "Visita programada para mañana",
    description:
      "Recordatorio de visita a la familia Ramírez (Barrio Norte) el 28 de noviembre a las 09:30 hs.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    priority: "high",
    category: "recordatorios",
    tags: ["Agenda", "Barrio Norte"],
  },
  {
    id: "notif-3",
    title: "Nuevo reporte semanal disponible",
    description:
      "Ya podés descargar el informe de indicadores del territorio correspondiente a la semana 47.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: "medium",
    category: "reportes",
    tags: ["Indicadores"],
  },
  {
    id: "notif-4",
    title: "Actualización de la plataforma",
    description:
      "Se agregó un nuevo filtro de búsqueda por programas sociales. Consultá los detalles en la sección de novedades.",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: "low",
    category: "sistema",
    tags: ["Novedad"],
  },
]);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(defaultNotifications);

  const addNotification = useCallback(
    (notification: NewNotificationInput) => {
      const id = notification.id ?? createNotificationId();
      const createdAt =
        notification.createdAt ?? new Date().toISOString();
      const next: NotificationItem = {
        ...notification,
        id,
        createdAt,
        read: notification.read ?? false,
      };

      setNotifications((prev) => sortNotifications([...prev, next]));
      return id;
    },
    [],
  );

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      ),
    );
  }, []);

  const markAsUnread = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, read: false } : item,
      ),
    );
  }, []);

  const toggleRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, read: !item.read } : item,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => (item.read ? item : { ...item, read: true })),
    );
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const latestNotification = useMemo(
    () => notifications[0] ?? null,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      latestNotification,
      addNotification,
      markAsRead,
      markAsUnread,
      toggleRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    }),
    [
      notifications,
      unreadCount,
      latestNotification,
      addNotification,
      markAsRead,
      markAsUnread,
      toggleRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications debe utilizarse dentro de NotificationsProvider",
    );
  }

  return context;
}


