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
  newHorse.save(function(err, horse) {
    if (err){
      res.send({status:400, err})
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
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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
      return res.status(400).json({message: "an error occurred"});
    }
    return res.status(200).json(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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
      return res.status(500).send({message: "an error occurred"});
    }
    return res.status(200).send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getPrivateHorses = function (req,res){ //todo must check also on riders, not only on the owner (or make another query?)
  const sort = {
    horseName: 1
  }

  Horse.find({ownerId:req.params.ownerId}).sort(sort).then(result => {
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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
      return res.sendStatus(200);
    }else{
      return res.sendStatus(400).json({message: "an error occurred"});
    }
  }).catch(err=> {
    res.sendStatus(500).json(err); //todo " Cannot set headers after they are sent to the client"
  });
}
