const loginController = require("../controllers/login-controller")
const signupController = require("../controllers/signup-controller")
const userController = require("../controllers/user-controller")
//const { verifySignup } = require("../middleware")

module.exports = function (app){

  app.route('/login')
    .post(loginController.login);

  app.route('/signup')
    .post(signupController.signup);


}
