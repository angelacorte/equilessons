const db = require("../models");
let User = db.user;
const {ObjectID, ObjectId} = require("mongodb");

/**
 * Get user's infos by user ID
 * @param req
 * @param res
 */
exports.getUserById = function (req,res){
  User.findOne({_id:new ObjectID(req.params.userId)},{password:0, token:0,__v:0}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

/**
 * Get all users subscribed to a club by its id
 * @param req
 * @param res
 */
exports.getUsersByClub = function (req,res) {
  User.find({clubId:req.params.clubId}, {name:1,surname:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/**
 * Get the roles of a specific user
 * @param req
 * @param res
 */
exports.getUserRoles = function (req,res) {
  User.findOne({_id:req.params.id},{roles:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/**
 * Add a role to a specific user
 * @param req
 * @param res
 */
exports.addRole = function (req,res){
  User.updateOne({_id:req.body.id},{$push:{roles: req.body.role}}).then(result=>{
    if(result.ok !== 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/**
 * Change the club of a specific user
 * @param req
 * @param res
 */
exports.changeClub = function (req,res) {
  User.updateOne({_id:req.body.userId}, {clubId: req.body.clubId}).then(result=>{
    if(result.ok !== 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.status(200).json({"clubId": req.body.clubId});
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/**
 * Delete a specific user
 * @param req
 * @param res
 */
exports.removeUser = function (req,res){
  let opts = {
    _id: {
      $in:req.body
    }
  }
  User.deleteMany(opts).then(result=>{
    if(result.deletedCount < 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

/**
 * Update user's infos
 * @param req
 * @param res
 */
exports.updateUser = function (req,res){

};

/**
 * Get all the horses linked to a specific user
 * @param req
 * @param res
 */
exports.getUserHorses = function (req,res){
  let pipeline = [
    {
      '$match': {
        '_id': new ObjectId(req.params.userId)
      }
    },{
      '$lookup': {
        'from': 'horses',
        'localField': 'horse',
        'foreignField': '_id',
        'as': 'horses_infos'
      }
    }, {
      '$project': {
        '_id': 1,
        "horses_infos._id":1,
        "horses_infos.horseName":1
      }
    }
  ];

  User.aggregate(pipeline).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });

}

