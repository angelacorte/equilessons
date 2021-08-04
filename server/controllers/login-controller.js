const db = require("../models");
User = require("../models/user-model"); //password already with salt
let jwt = require("jsonwebtoken");
require('dotenv').config();

//TODO find how to manage remember me, to make not necessary login every time one wants to visit the site


function generateAccessToken(userId){
  return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: '365d' // expires in 1 year
  })
}

exports.login = function (req,res) {
  console.log("login controller login");
  User.getAuthenticated(req.body.username, req.body.password, function (err, user, reason) {
    if (err) {
      throw err;
    }
    console.log("user e pass",req.body.username, req.body.password);
    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = jwt.sign(JSON.stringify(user._id), process.env.REFRESH_TOKEN_SECRET);
      let userSess = {};

      const filter = {"_id": user._id};
      const update = {"token": refreshToken};

      User.findOneAndUpdate(filter, update, {
        new: true
      }).then(result => {
        if (!result) {
          res.status(500).json({"accessToken": accessToken, "refreshToken": refreshToken});
        }
        console.log("login successfull");
        res.status(200).json({"accessToken": accessToken, "refreshToken": refreshToken, "user": user});
      }).catch(err => {
        console.log("Error: ", err.message);
      });
    }


    let reasons = User.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.status(401).json({"description": "incorrect username or password"});
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.status(401).json({"description": "incorrect username or password"});
        break;
      /*case reasons.MAX_ATTEMPTS:
        // send email or otherwise notify user that account is
        // temporarily locked
        res.status(401).json({"description": "you have been locked"});
        break;*/
    }
  });
}

exports.authenticate = function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] //takes the token if exists

  if(token == null || typeof token === undefined){
    return res.status(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
    if(err){
      console.log("TOKEN: ", + token);
      console.log(err);
      return res.sendStatus(403);
    }

    User.findById(user.userId, function (err,user){
      if(err){
        return res.sendStatus(500);
      }
      console.log(user)
      if(!user){
        return res.sendStatus(404);
      }
      req.user = user;
      next();
    }).catch(err => {
      console.log("Error: ", err.message);
    });
  })
}

exports.token = function (req,res){
  const refreshToken = req.body.token;
  if(refreshToken == null){
    return res.sendStatus(401);
  }
  User.findOne({"token":refreshToken}, function (err,doc) {
    if(err){
      return res.sendStatus(500);
    }
    if(doc == null){
      return res.sendStatus(403);
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
      if(err){
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({"name": user.name});
      return res.json({"accessToken":accessToken});
    })
  }).catch(err => {
    console.log("Error: ", err.message);
  });
}

exports.logout = function (req,res) {
  const filter = { "token": req.body.token};
  const update = { "token": ""};

  User.findOneAndUpdate(filter, update,{
    new:true
  }).then(result =>{
    if(!result){
      return res.sendStatus(404).json({"description":"no token found"});
    }
    res.sendStatus(204);
  }).catch(err => {
    console.log("Error: ", err.message);
  });
}
