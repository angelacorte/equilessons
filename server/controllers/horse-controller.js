const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let ObjectId = require('mongodb').ObjectID;


exports.addHorse = function (req,res){
  let newHorse = new Horse(req.body);
  newHorse.save(function(err, horse) {
    if (err){
      res.send(err);
    }
    res.status(200).json(horse);
  });
}

exports.getScholasticHorses = function (req,res) {
  Horse.find({clubId:new ObjectId(req.params.clubId), scholastic:true}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getHorseInfos = function (req,res){
  Horse.find({_id:new ObjectId(req.params.horseId)}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

exports.getHorses = function (req,res){
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

  Horse.aggregate(pipeline).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
