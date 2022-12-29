export enum NotificationType {
  ADD = "add-lesson",
  UPDATE = "update-lesson",
  DELETE = "delete-lesson",
  INFO = "info"
}

export interface NotificationMessage{
  notificationId: string,
  senderId: string,
  recipientId: string,
  lessonId?: string,
  lessonDate?: string,
  notificationType: NotificationType,
  notificationDate: Date,
  message?: string
}
