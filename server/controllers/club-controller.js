const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

exports.findClubByName = function (req,res){
  console.log("req.name: ", req.params.clubName); // debug string
  Club.findOne({"name":req.params.clubName}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    console.log("findclubbyname: ", result); //debug string
    res.status(200).send({message:"Club has id: " + result._id});
  });
}
