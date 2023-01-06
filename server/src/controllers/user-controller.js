const db = require("../models");
let User = db.user;
const {ObjectId} = require("mongodb");

/**
 * Get user's infos by user ID
 * @param req
 * @param res
 */
exports.getUserById = function (req,res){
  User.findOne({_id:new ObjectId(req.params.userId)},{password:0, token:0,__v:0}).then(user=>{
    if(!user){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.send({status: 200, user: user})
    }
  }).catch(err=> {
    return res.send({status: 500, error: err});
  });
};

/**
 * Get all users subscribed to a club by its id
 * @param req
 * @param res
 */
exports.getUsersByClub = function (req,res) { //todo maybe useless
  const sort = {
    surname:1,
    name:1
  }
  User.find({clubId:req.params.clubId}, {name:1,surname:1}).sort(sort).then(result=>{
    if(!result){
      return res.status(400)
    }
    return res.send({status: 200, result});
  }).catch(err=> {
    return res.send({status: 500, message: "Error ", error: err});
  });
}

/**
 * Get the roles of a specific user
 * @param req
 * @param res
 */
exports.getUserRoles = function (req,res) {
  User.findOne({_id:req.params.id},{roles:1, _id:0}).then(result=>{
    if(!result){
      return res.sendStatus(400);
    }else{
      return res.send({status: 200, roles: result});
    }
  }).catch(err=> {
    return res.send({status: 500, error: err});
  });
}

/**
 * Add a role to a specific user
 * @param req
 * @param res
 */
exports.addRole = function (req,res){
  User.updateOne({_id:req.body.id},{$push:{roles: req.body.role}}).then(result=>{
    if(result.modifiedCount > 0 ){
      return res.send({status: 200})
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}

exports.removeRole = function (req, res){
  User.updateOne({_id:req.body.id}, {$pull:{roles: req.body.role}}).then(result => {
    if(result.modifiedCount > 0 ){
      return res.send({status: 200})
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  })
}


/**
 * Update user's infos
 * @param req
 * @param res
 */
exports.updateUser = function (req,res){ //todo
  let update = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthday: req.body.birthday,
    username: req.body.username,
    phoneNumber: req.body.phoneNumber,
    taxcode: req.body.taxcode,
    city: req.body.city,
    address: req.body.address,
    nrFise: req.body.nrFise,
    clubId: req.body.clubId,
  }
  //TODO add check on email already in use
  User.updateOne({_id:req.body._id}, update).then(result=>{
    console.log("update user ", result)
    if(result.modifiedCount > 0){
      return res.send({status: 200, user: update});
    }else{
      return res.sendStatus(400)
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
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
    if(result.deletedCount > 0){
      return res.send({status: 200, result});
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
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
        '_id': 0,
        "horses_infos._id":1,
        "horses_infos.horseName":1,
      }
    }
  ];

  const sort = {
    horseName: 1
  }

  User.aggregate(pipeline).sort(sort).then(horses=>{
    if(!horses){
      return res.send({status: 400,message: "Bad request"});
    }else{
      return res.send({status: 200, horses: horses});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });

}

