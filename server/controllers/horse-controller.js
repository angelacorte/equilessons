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
