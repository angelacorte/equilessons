let jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 * Create new access token for  login
 * @param id
 * @return {token | error}
 */
exports.generateAccessToken = function (id) {
  return jwt.sign({id}, `${process.env.ACCESS_TOKEN_SECRET}`,{
    expiresIn: '30d' // expires in 1 month
  }, function (err, token) {
    if(err) throw err;
    else return token;
  })
}

