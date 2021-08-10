const config = require("../config/auth.config"); //secret phrase
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

      console.log("req.body.clubId signup controller ", req.body.club)
      Club.getClubByName(req.body.club);

      console.log('clubInfo signup controller ')

      newUser.save(function(err, user) {
        if (err){
          res.send(err);
        }
        res.status(201).json(user);
      });
    }
  })
};
