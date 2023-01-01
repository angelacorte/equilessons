//const config = require('../config/auth.config');
const db = require("../models");
const User = db.user; //password already with salt
const bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10;

/**
 * User registration
 * @param req
 * @param res
 */
exports.signup = function(req, res) {
  User.findOne({
    $or:[{
      phoneNumber:req.body.phoneNumber
    }]
  }).then(async u => { //todo manca controllo su email e username che non devono essere duplicati
    if (u && u.email !== undefined) {
      res.status(409).send({"description": "telephone number already in use"})
    }else{ //if user does not exists or exists without email (means that it's a temporary user, so it is possible to overwrite his infos)
      if(u == null){
        let user = new User(await setUserFields(req.body))
        user.save(function (err, user) {
          if (err) {
            res.send({status: 400, message: "error while saving user"})
            return err;
          }else{
            return res.send({status: 200, message: "user added", user});
          }
        })
      }else if(u.email === undefined){ //was a temporary user
        let updateUser = await setUserFields(req.body)
        User.updateOne({phoneNumber: updateUser.phoneNumber}, updateUser).then(result => {
          if(result.nModified === 1){
            delete updateUser.password;
            res.send({status: 200, message:"user added", updateUser})
          }else{
            res.send({status: 400, message: "error while saving user"})
          }
        });
      }
    }
  })
};

exports.signupTemporary = function (req, res){
  User.findOne({
    $or:[{
      phoneNumber:req.body.phoneNumber
    }]
  }).then(response => {
    if(response !== null){
      res.send({status: 409, message: "telephone number already exists"})
    }else{
      let temp = {
        name: req.body.name,
        surname: req.body.surname,
        phoneNumber: req.body.phoneNumber,
        clubId: req.body.clubId
      }
      let newUser = new User(temp);
      newUser.save(function (err, user) {
        if (err) {
          res.send({status: 400, message: "error while saving user"})
          return err;
        }else{
          return res.send({status: 200, message: "temporary user added", user});
        }
      })
    }
  })
}

async function hashPassword (password) {
  let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  return await bcrypt.hash(password, salt);
}

async function setUserFields(body) {
  let hash = await hashPassword(body.password);
  return {
    isOwner: body.isOwner,
    roles: [],
    horse: [],
    name: body.name,
    surname: body.surname,
    email: body.email,
    birthday: body.birthday,
    username: body.username,
    password: hash,
    phoneNumber: body.phoneNumber,
    taxCode: body.taxCode,
    city: body.city,
    address: body.address,
    nrFise: body.nrFise,
    clubId: body.clubId
  };
}

