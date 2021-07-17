const db = require("../models");
const users = db.users;
const bcrypt = require("bcrypt");

//signup of a new user
exports.signup = (req,res)=>{

};

//login of an existing user
exports.login = (req,res)=>{
  /*users.findOne({email:req.body['email']}).then(user=>{
    if(!user){
      console.log("ERROR: user not found.");
    }else{
      bcrypt.compare(req.body['password'], user['password'], (err,result)=>{
        if(err){
          console.log("error: ", err.message);
        }else{
          console.log("user found");
        }
      })
    }
  })*/
};

//find one user
exports.findOneUser = (req,res)=>{

};

//find all users
exports.findAllUsers = (req,res)=>{

};

//delete one user
exports.deleteOneUser = (req,res)=>{

};

//update user info
exports.updateUser = (req,res)=>{

};
