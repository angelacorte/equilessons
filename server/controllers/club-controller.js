const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let ObjectId = require('mongodb').ObjectID;

exports.getClubByName = function (req,res,name){
  Club.findOne({$or:[{"clubName": req.params.clubName},{"clubName":name}]}).then(result=>{
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

exports.addClub = function (req,res) {
  let newClub = new Club(req.body);
  newClub.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(201).json(user);
  });
}
