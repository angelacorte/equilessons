export enum NotificationType {
  ADD = "add-lesson",
  UPDATE = "update-lesson",
  DELETE = "delete-lesson",
  INFO = "info"
}

export interface NotificationMessage{
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
