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

//delete one user
exports.deleteOneUser = function (req,res){

};

//update user info
exports.updateUser = function (req,res){

};
