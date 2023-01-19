const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

let NotificationSchema = new Schema({
    senderId: {type:Schema.Types.ObjectId, ref:"User", required: true},
    recipientId: [{type:Schema.Types.ObjectId, ref:"User", required: true}],
    lessonId: {type:Schema.Types.ObjectId, ref:"Lesson"},
    lessonDate: {type: Date},
    notificationType: {type: String, required: true},
    notificationDate: {type: Date, required: true},
    message: {type: String}
})

module.exports = mongoose.model("Notification", NotificationSchema, "notifications")