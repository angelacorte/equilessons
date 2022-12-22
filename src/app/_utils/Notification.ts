export enum NotificationType {
  MODIFY = " ha apportato modifiche alla lezione del ",
  ADD = " ti ha aggiunto alla lezione del ",
  DELETED = " ha annullato la lezione del ",
  HORSE = " ti ha assegnato il cavallo "
}

export interface NotificationMessage{
  sender: string,
  lessonID: string,
  lessonDate: string, //todo Date
  message: NotificationType,
  date: string,
  horseName?: string
}