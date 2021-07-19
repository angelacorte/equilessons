const db = require("../models");
const user = require("../models/user-model"); //password already with salt

//var jwt = require("jsonwebtoken");
//const config = require("../config/auth.config");

exports.login = function (req,res){
  user.findOne({
    $or:[{
      username: req.body.username
    },{
      email: req.body.email
    }]
  }).then(tmpUser=>{
    if(!tmpUser){
      return res.status(404).send({message:"User not found"});
    }

    tmpUser.comparePassword(req.body.password, function (err, isMatch) {
      if(err){
        return user.cb(err);
      }else{
        /*const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: '365d' // 24 hours, better to extend it
        });*/
        return res.status(200).send({message:"password match",
          id:user._id,
          username:user.username,
          email:user.email,
          //accessToken: token
        });
      }
    })
  })
}
