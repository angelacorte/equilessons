const arenaController = require("../controllers/arena-controller");
const clubController =require("../controllers/club-controller");
const groupController = require("../controllers/group-controller");
const horseController = require("../controllers/horse-controller");
const lessonController = require("../controllers/lesson-controller");
const loginController = require("../controllers/login-controller");
const roleController = require("../controllers/role-controller");
const signupController = require("../controllers/signup-controller");
const userController = require("../controllers/user-controller");
//const { verifySignup } = require("../middleware")

module.exports = function (app){

  //ARENA
  app.route('/club/:clubName')
    .get(clubController.findClubByName); //returns club's id
  //CLUB

  //GROUP

  //HORSE

  //LESSON
  app.route('/create-lesson')
    .post(lessonController.createLesson);


  //ROLE

  //USER
  app.route('/login')
    .post(loginController.login);

  app.route('/signup')
    .post(signupController.signup);

}
