const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let clubController = require("../controllers/club-controller")
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let ObjectId = require('mongodb').ObjectID;


exports.getArenaByName = function (req,res){ //gets all the info of an arena by its name
  Arena.findOne({"arenaName":req.params.arenaName}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

//db.clubs.aggregate([{ $match:{"_id":ObjectId("60f702d3329ccb26f26937a0")}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasClub"}}])

exports.addArena = function (req,res){
  let docs = req.body.newArenas;
  Arena.insertMany(docs).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getArenasByClubId = function (req,res){
  Arena.find({"clubId":req.params.clubId}, {"clubId":0}).then(result=>{
    console.log(result);
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.removeArena = function (req,res){
  let opts = {
    _id: {
      $in:req.body
    }
  }
  Arena.deleteMany(opts).then(result=>{
    console.log(result);
    if(result.deletedCount < 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
