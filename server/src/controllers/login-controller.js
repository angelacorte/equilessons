User = require("../models/user-model"); //password already with salt
let jwt = require("jsonwebtoken");
const { club } = require("../models");
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
      User.findOne({"_id": user._id}, {password:0}).then(userRes => {
        if (!userRes) {
          res.send({status: 400, accessToken: accessToken, refreshToken: refreshToken});
        }else{
          res.send({status: 200, accessToken: accessToken, refreshToken: refreshToken, user: userRes});
        }
      })
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

exports.authenticate = async function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];

  jwt.verify(authHeader, `${process.env.ACCESS_TOKEN_SECRET}`, {}, async (err,user)=>{
    if(err){ return res.sendStatus(403); }
    try {
      req.user = await User.findById(user.id)
      next()
    } catch(err) {
      let c = await club.findById(user.id)
      if(c) {
        req.user = c
        next()
      } else {
        res.sendStatus(404)
      }
    }
  })
}
