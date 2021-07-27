const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let clubController = require("../controllers/club-controller")
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

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

exports.getArenaByClub = function (req,res) { //gets all the arena in a club
  Arena.find({"club":req.params.clubId}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.addArena = function (req,res){
  let newArena = new Arena(req.body)
  newArena.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(201).json(user);
  });
}
