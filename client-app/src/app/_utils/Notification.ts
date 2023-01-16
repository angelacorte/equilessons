export enum NotificationType {
  ADD = "Nuova lezione",
  UPDATE = "Lezione annullata",
  DELETE = "Lezione cancellata",
  INFO = "info"
}

export interface NotificationMessage{
  sender?: string;
  notificationId?: string,
  senderId: string,
  recipientId: string,
  lessonId?: string,
  lessonDate?: Date,
  notificationType: NotificationType,
  notificationDate: Date,
  message?: string,
  checked: boolean
}

export function Notification(
  senderId: string,
  recipientId: string,
  notificationType: NotificationType,
  notificationDate: Date,
  lessonId?: string,
  lessonDate?: Date,
  message?: string,
  notificationId?: string,): NotificationMessage {
    return {
      notificationId: notificationId,
      senderId: senderId,
      recipientId: recipientId,
      lessonId: lessonId,
      lessonDate: lessonDate,
      notificationType: notificationType,
      notificationDate: notificationDate,
      message: message,
      checked: false
    }
  }
