//const config = require('../config/auth.config');
const db = require("../models");
const User = db.user; //password already with salt
const bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10;


exports.signup = function(req, res) {
  console.log("req.body.phoneNumber",req.body.phoneNumber);
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
        let hash = hashPassword(newUser.password);
        let update = {
          isOwner: newUser.isOwner,
          roles: [],
          horse: [],
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          birthday: newUser.birthday,
          username: newUser.username,
          password: hash,
          phoneNumber: newUser.phoneNumber,
          taxcode: newUser.taxcode,
          city: newUser.city,
          address: newUser.address,
          nrFise: newUser.nrFise,
          clubId: newUser.clubId
      };

        User.updateOne({phoneNumber: newUser.phoneNumber}, update).then(result=>{
          console.log("result", result);
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

function hashPassword (password){
  try{
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err,salt) {
      if(err) return err;
      else{
        bcrypt.hash(password,salt, function (error, hash) {
          if(error) return error;
          else return hash;
        })
      }
    })
  } catch (e){
    return e;
  }
}
