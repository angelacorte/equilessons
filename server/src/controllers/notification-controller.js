const Notification = require("../models/notification-model")

const sockets = require('../utils/socket').sockets

exports.addNotification = async (req, res) => {
    let n = new Notification(req.body)
    try {
        //store the notification message inside the database
        let notification = await n.save()
        //send a push notification to the client socket
        pushNotificationToClientSocket(n.recipientId, n)
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

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.remove({_id: req.params.notificationId})
        res.sendStatus(200)
    } catch(err) {
        res.status(404).send(err)
    }
}

function pushNotificationToClientSocket(id, notification){
    const socket = sockets.get(""+id);
    socket.emit('notify-client', { data: notification });
};