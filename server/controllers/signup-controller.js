//const config = require('../config/auth.config');
const db = require("../models");
const User = db.user; //password already with salt
const Club = require('./club-controller')

exports.signup = function(req, res) {
  User.findOne({
    $or:[{
      phoneNumber:req.body.phoneNumber
    }] /*,{
      username: req.body.username
    },{
      email:req.body.email
    }*/
  }).then(u => {
    if (u && u.email !== undefined)  {
      res.status(409).send({"description": "email or username already in use"})
    }else{ //if user does not exists or exists without email (means that it's a temporary user, so it is possible to overwrite his infos)
      let newUser = new User(req.body);
      if(newUser.email !== undefined){
        User.updateOne({phoneNumber: newUser.phoneNumber}).then(result=>{
          if(result.ok !== 1){
            return res.status(500).send({message: "an error occurred"});
          }
          return res.send(result);
        }).catch(err=> {
          console.log("Error: ", err.message);
        });
      }else{
        newUser.save(function(err, user) {
          if (err){
            res.send(err);
          }
          res.status(200).json(user);
        });
      }
    }
  })
};
