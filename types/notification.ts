export type NotificationPriority = "low" | "medium" | "high" | "critical";

export type NotificationCategory =
  | "seguimiento"
  | "reportes"
  | "recordatorios"
  | "sistema";

export interface NotificationActionLink {
  label: string;
  href?: string;
  external?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  tags?: string[];
  actionLink?: NotificationActionLink;
}

export type NewNotificationInput = Omit<NotificationItem, "id" | "read" | "createdAt"> & {
  id?: string;
  read?: boolean;
  createdAt?: string;
};


