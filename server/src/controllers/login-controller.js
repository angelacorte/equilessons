User = require("../models/user-model"); //password already with salt
let jwt = require("jsonwebtoken");
const {generateAccessToken} = require("../utils/controller-utils");
require('dotenv').config();

/**
 * Check on user login
 * @param req
 * @param res
 */
exports.login = function (req,res) {
  User.getAuthenticated(req.body.username, req.body.password, async function (err, user, reason) {
    if (err) {
      res.send({status: 500, message: "an error occurred", error: err})
    }
    if (user) {
      const accessToken = await generateAccessToken(user._id);
      const refreshToken = jwt.sign(JSON.stringify(user._id), `${process.env.REFRESH_TOKEN_SECRET}`);

      const filter = {"_id": user._id};
      const update = {"token": refreshToken};

      User.findOneAndUpdate(filter, update, {
        new: true,
        projection: {
          'password': 0
        }
      }).then(userRes => {
        if (!userRes) {
          res.send({status: 400, accessToken: accessToken, refreshToken: refreshToken});
        }else{
          res.send({status: 200, accessToken: accessToken, refreshToken: refreshToken, user: userRes});
        }
      })/*.catch(err => {
            return res.send({status: 500, message: "an error occurred", error: err});

      });*/
    }

    let reasons = User.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.send({status: 404, description: "wrong username or password"});
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.send({status: 401, description: "wrong username or password"});
        break;
    }
  });
}

exports.authenticate = function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] //takes the token if exists

  if(token == null || typeof token === undefined){
    return res.sendStatus(401);
  }

  jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, {},(err,user)=>{ //todo options
    if(err){ return res.sendStatus(403); }

    User.findById(user.userId, function (err,user){
      if(err){ return res.sendStatus(500); }
      if(!user){ return res.sendStatus(404); }
      req.user = user;
      next();
    })
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
    return res.send({status: 500, message: "an error occurred", error: err});
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
      return res.send({status: 404, description:"no token found"});
    }
    res.sendStatus(204);
  }).catch(err => {
    return res.send({status: 500, description:err});
  });
}
