const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

let NotificationSchema = new Schema({
    senderId: {type:Schema.Types.ObjectId, refPath: 'model_type', required: true},
    recipientId: [{type:Schema.Types.ObjectId, refPath: 'model_type', required: true}],
    lessonId: {type:Schema.Types.ObjectId, ref:"Lesson"},
    lessonDate: {type: Date},
    notificationType: {type: String, required: true},
    notificationDate: {type: Date, required: true},
    message: {type: String},
    model_type: {type:String, enum:['User', 'Club']}
})

module.exports = mongoose.model("Notification", NotificationSchema, "notifications")