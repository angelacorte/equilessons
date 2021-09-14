//const config = require('../config/auth.config');
const db = require("../models");
const User = db.user; //password already with salt
const Club = require('./club-controller')

exports.signup = function(req, res) {
  //console.log(req.body);
  User.findOne({
    $or:[{
      username: req.body.username
    },{
      email:req.body.email
    }]
  }).then(tmpUser => {
    if (tmpUser)  {
      res.status(409).send({"description": "email or username already in use"})
    }else{
      let newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err){
          res.send(err);
        }
        res.status(200).json(user);
      });
    }
  })
};
