const Notification = require("../models/notification-model")
const {ObjectId} = require("mongodb");

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
        await Notification.deleteOne({_id: req.params.notificationId})
        res.status(200)
    } catch(err) {
        res.status(404).send(err)
    }
}

exports.getNotificationSender = function (req,res){
    let pipeline = [
        {
            '$match': {
                'senderId': new ObjectId(req.params.senderId)
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'senderId',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$lookup': {
                'from': 'clubs',
                'localField': 'senderId',
                'foreignField': '_id',
                'as': 'club'
            }
        }, {
            '$project': {
                'user.name': 1,
                'user.surname': 1,
                'user._id': 1,
                'senderId': 1,
                'club.clubName': 1,
                'club._id': 1
            }
        }
    ]
    Notification.aggregate(pipeline).then(result => {
        if(!result){
            return res.send({status: 400, message: "Bad request"});
        }else{
            return res.send({status: 200, sender: result[0]})
        }
    }).catch(err =>{
        return res.status(404).send(err)
    })
}

function pushNotificationToClientSocket(id, notification){
    const socket = sockets.get(""+id);
    socket.emit('notify-client', { data: notification });
};