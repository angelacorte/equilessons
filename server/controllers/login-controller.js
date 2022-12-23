User = require("../models/user-model"); //password already with salt
let jwt = require("jsonwebtoken");
const {generateAccessToken} = require("../utils/controller-utils");
require('dotenv').config();

/**
 * Check on user login
 * @param req
 * @param res
 */
exports.login = function (req,res) { //TODO manage errors

  User.getAuthenticated(req.body.username, req.body.password, function (err, user, reason) {
    if (err) {
      console.log("error 0: " + err)
      throw err;
    }
    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = jwt.sign(JSON.stringify(user._id), `${process.env.REFRESH_TOKEN_SECRET}`, { }, //todo options
        function(err, token){
          if(err) throw err;
          else return token;
      }); //TODO error

      const filter = {"_id": user._id};
      const update = {"token": refreshToken};

      User.findOneAndUpdate(filter, update, {
        new: true
      }).then(result => {
        if (!result) {
          res.status(500).json({"accessToken": accessToken, "refreshToken": refreshToken});
        }
        res.status(200).json({"accessToken": accessToken, "refreshToken": refreshToken, "user": user});
      })/*.catch(err => {
        console.log("Error: ", err.message);
      });*/
    }

    let reasons = User.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.status(404).json({"description": "wrong username or password"});
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.status(401).json({"description": "wrong username or password"});
        break;
    }
  });
}

exports.authenticate = function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] //takes the token if exists

  if(token == null || typeof token === undefined){
    return res.status(401);
  }

  jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, {},(err,user)=>{ //todo options
    if(err){ return res.sendStatus(403); }

    User.findById(user.userId, function (err,user){
      if(err){ return res.sendStatus(500); }
      if(!user){ return res.sendStatus(404); }
      req.user = user;
      next();
    })/*.catch(err => {
      console.log("Error: ", err.message);
    })*/
  })
}

exports.token = function (req,res){
  const refreshToken = req.body.token;
  if(refreshToken == null){ return res.sendStatus(401); }
  User.findOne({"token":refreshToken}, function (err,doc) {
    if(err){ return res.sendStatus(500); }
    if(doc == null){ return res.sendStatus(403); }
    jwt.verify(refreshToken,`${process.env.REFRESH_TOKEN_SECRET}`, {},(err,user)=>{ //todo options
      if(err){ return res.sendStatus(403); }
      const accessToken = generateAccessToken({"name": user.name});
      return res.json({"accessToken":accessToken});
    })
  }).catch(err => {
    console.log("Error 1: ", err.message);
  });
}

/**
 * User's logout, remove its token
 * @param req
 * @param res
 */
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
    console.log("Error 2: ", err.message);
  });
}
