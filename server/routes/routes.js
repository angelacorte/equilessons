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

  //---------------------------------ARENA---------------------------------
  app.route('/arenaName/:arenaName')
    .get(arenaController.getArenaByName); //returns arena's info



  app.route('/arena')
    .post(loginController.authenticate, arenaController.addArena);

  //---------------------------------CLUB---------------------------------
  app.route('/club')
    .post(clubController.addClub);

  app.route('/clubId/:id')
    .get(clubController.getClubById)

  app.route('/clubName/:clubName')
    .get(clubController.getClubByName); //returns club's info

  app.route('/clubArenas')
    .get(clubController.getClubArenas); //return all the arenas in a club

  //---------------------------------GROUP---------------------------------

  //---------------------------------HORSE---------------------------------
  app.route('/horse')
    .post(horseController.addHorse);

  app.route('/getSchoolHorses/:clubId')
    .get(horseController.getScholasticHorses);

  app.route('/horse/:horseId')
    .get(horseController.getHorseInfos);

  //---------------------------------LESSON---------------------------------
  app.route('/create-lesson')
    .post(lessonController.createLesson);


  //---------------------------------ROLE---------------------------------

  //---------------------------------USER---------------------------------
  app.route('/login')
    .post(loginController.login);

  app.route('/signup')
    .post(signupController.signup);

}
