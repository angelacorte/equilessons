const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let ObjectId = require('mongodb').ObjectID;

exports.getAllClubs = function (req,res) {
  Club.find({},{_id:1,clubName:1}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubByName = function (club, req,res){
  let clubN;
  console.log("club ", club)
  if(req !== undefined){
    clubN = req.params.clubName;
  }else if(club){
    clubN = club;
  }
  Club.findOne({"clubName": clubN}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubById = function (req,res){
  Club.findOne({"_id":new ObjectId(req.params.id)}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubArenas = function (req,res) { //gets all the arenas in a club
  let clubId = new ObjectId("60f702d3329ccb26f26937a0") //new ObjectId(req.club.clubId); //TODO make this generic with the infos of the one who has logged, now is specific for "delta team"
  Club.aggregate([{$match:{"_id": clubId}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasInClub"}}]).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.addClub = function (req,res) {
  let newClub = new Club(req.body);
  newClub.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(201).json(user);
  });
}

/*
db.arenas.aggregate([{ $match:{"clubId":ObjectId("60f702d3329ccb26f26937a0")}},{$lookup:{from:"clubs",localField:"clubId",foreignField:"_id",as:"arenasClub

//this finds all the arenas that a club has:
//db.clubs.aggregate([{ $match:{"_id":ObjectId("60f702d3329ccb26f26937a0")}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasClub"}}])

{ $match:"}}])
  {
    "_id":ObjectId("60f702d3329ccb26f26937a0")
  }
},{$lookup:{
  from:"arenas",
    localField:"clubId",
    foreignField:"_id",
    as:"arenasClub"
}}
*/
