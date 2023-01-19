const db = require("../models");
let Horse = db.horse;

let ObjectId = require('mongodb').ObjectID;


/**
 * Add new horse, linked to the person who adds it and the club in which the owner is subscribed to
 * @param req
 * @param res
 */
exports.addHorse = function (req,res){
  let newHorse = new Horse(req.body);
  newHorse.ownerId = new ObjectId(req.body.ownerId)
  newHorse.riders = []
  let riders = req.body.riders
  if(riders) {
    riders.forEach(r => newHorse.riders.push(new ObjectId(r)))
  }
  newHorse.save(function(err, horse) {
    if (err){
      return res.send({status: 400, message: "Bad request " + err});
    }else{
      res.send({status: 200, horse: horse})
    }
  });
}

/**
 * Get all horses that are dispatched to school's lessons
 * @param req
 * @param res
 */
exports.getScholasticHorses = function (req,res) {
  Horse.find({clubId:new ObjectId(req.params.clubId), scholastic:true}).sort({horseName:1}).then(result =>{
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.send(result);
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

exports.getHorseOwner = function (req,res){
  let pipeline = [
    {
      '$match': {
        '_id': new ObjectId(req.params.horseId)
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'ownerId',
        'foreignField': '_id',
        'as': 'owner'
      }
    }, {
      '$lookup': {
        'from': 'clubs',
        'localField': 'ownerId',
        'foreignField': '_id',
        'as': 'club'
      }
    }, {
      '$project': {
        'owner.name': 1,
        'owner.surname': 1,
        'owner._id': 1,
        'club.clubName': 1,
        'club._id': 1,
        '_id': 0
      }
    }
  ]
  Horse.aggregate(pipeline).then(result => {
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.send({status: 200, horseOwner: result[0]})
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

/**
 * Get all the infos of a horse by its ID
 * @param req
 * @param res
 */
exports.getHorseInfos = function (req,res){
  Horse.find({_id:new ObjectId(req.params.horseId)}).then(result=>{
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.send({status: 200, horse: result[0]});
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
};

/**
 * Get all horses inside a club, by club's ID
 * @param req
 * @param res
 */
exports.getHorses = function (req,res){
  const sort = {
    "horseOwner.surname":1,
    "horseOwner.name":1,
    "horseName":1
  }
  let pipeline = [
    {
      '$match': {
        'clubId': new ObjectId(req.params.clubId)
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'ownerId',
        'foreignField': '_id',
        'as': 'horseOwner'
      }
    }, {
      '$lookup': {
        'from': 'clubs',
        'localField': 'ownerId',
        'foreignField': '_id',
        'as': 'clubOwner'
      }
    }, {
      '$project': {
        'horseOwner._id': 1,
        'horseOwner.name': 1,
        'horseOwner.surname': 1,
        'horseName': 1,
        'riders': 1,
        'scholastic': 1,
        'clubOwner.clubName': 1,
        'clubOwner._id': 1
      }
    }
  ];

  Horse.aggregate(pipeline).sort(sort).then(result=>{
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.status(200).send(result);
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

exports.getPrivateHorses = function (req,res){
  const sort = {
    horseName: 1
  }
  const filter = {$or: [
    {'ownerId': new ObjectId(req.params.ownerId)},
    {'riders': new ObjectId(req.params.ownerId)}
  ]}

  Horse.find(filter).sort(sort).then(result => {
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }else{
      return res.send(result);
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

exports.removeHorse = function (req,res){
  let ids = req.body;
  ids.forEach((id,index) => {
    ids[index] = new ObjectId(id);
  })
  let query = { _id: { $in: ids}};
  Horse.deleteMany(query).then((result) => {
    if(result.deletedCount === ids.length){
      return res.send({status: 200});
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

exports.updateHorse = function (req,res){
  let update = {
    horseName: req.body.horseName,
    horseMicrochip: req.body.horseMicrochip,
    ownerId: req.body.ownerId,
    clubId: req.body.clubId,
    horseFise: req.body.horseFise,
    horseBirthday: req.body.horseBirthday,
    riders: req.body.riders,
    scholastic: req.body.scholastic
  }

  Horse.updateOne({_id: req.body._id}, update).then(result => {
    if(result.modifiedCount > 0){
      return res.send({status: 200, horse: update});
    }else{
      return res.sendStatus(400)
    }
  }).catch(err => {
    return res.send({status: 500, message: "an error occurred", error: err});
  })
}
