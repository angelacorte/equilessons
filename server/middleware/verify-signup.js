const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {

  //with username
  User.findOne({
    username: req.hasBody.username
  }).exec((err,user) => {
    if(err){
      res.status(500).send({message:err}); //internal server error
      return;
    }

    if(user){
      res.status(400).send({message: "Failed: username is already in use"}); //400 bad request
      return;
    }

    //with email
    User.findOne({
      email:req.body.email
    }).exec((err,user) => {
      if(err){
        res.status(500).send({message: err});
        return;
      }

      if(user){
        res.status(400).send({message: "Failed: email is already in use"});
        return;
      }

      next();
    })
  })
}

const verifySignup = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignup;
