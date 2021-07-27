const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

exports.addHorse = function (req,res){
  let newHorse = new Horse(req.body);
  newHorse.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(201).json(user);
  });
}

exports.getScholasticHorses = function (req,res) {
  console.log("enters getscholastichorses")
  Horse.find({clubId:req.params.clubId, scholastic:true}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
