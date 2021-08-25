const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;
const bcrypt = require("bcrypt");

//find one user
exports.getUserByName = function (req,res){

};

//find all users
exports.getAllUsers = function (req,res){

};

exports.getUserRoles = function (req,res) {
  User.findOne({_id:req.params.id},{roles:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    console.log("getuserroles result ", result)

    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.addRole = function (req,res){
  User.updateOne({_id:req.body.id},{$push:{roles: req.body.role}}).then(result=>{
    if(result.ok !== 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.changeClub = function (req,res) {
  User.updateOne({_id:req.body.userId}, {clubId: req.body.clubId}).then(result=>{
    if(result.ok !== 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.status(200).json({"clubId": req.body.clubId});
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

//delete one user
exports.deleteOneUser = function (req,res){

};

//update user info
exports.updateUser = function (req,res){

};
