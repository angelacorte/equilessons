const Notification = require("../models/notification-model")

exports.addNotification = async (req, res) => {
    let n = new Notification(req.body)
    try {
        let notification = await n.save()
        res.status(201).json(notification)
    } catch(err) {
        res.send(err)
    }
}

exports.getUserNotifications = async (req, res) => {
    try {
        let notifications = await Notification.find({recipientId: req.params.recipientId})
        res.status(200).json(notifications)
    } catch(err) {
        res.send(err)
    }
}