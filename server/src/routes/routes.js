const arenaController = require("../controllers/arena-controller");
const clubController =require("../controllers/club-controller");
const groupController = require("../controllers/group-controller");
const horseController = require("../controllers/horse-controller");
const lessonController = require("../controllers/lesson-controller");
const loginController = require("../controllers/login-controller");
const roleController = require("../controllers/role-controller");
const signupController = require("../controllers/signup-controller");
const userController = require("../controllers/user-controller");
const notificationController = require("../controllers/notification-controller")
//const { verifySignup } = require("../middleware")

module.exports = function (app){

  //---------------------------------ARENA---------------------------------
  app.route('/arenaName/:arenaName')
    .get(arenaController.getArenaByName); //returns arena's info

  app.route('/arena/:clubId')
    .get(arenaController.getArenasByClubId);

  app.route('/arena')
    .post(/*loginController.authenticate,*/ arenaController.addArena);

  app.route('/arena')
    .delete(arenaController.removeArena);

  //---------------------------------CLUB---------------------------------
  app.route('/club')
    .get(clubController.getAllClubs)
    .post(clubController.registerClub);

  app.route('/club/login')
    .post(clubController.clubLogin);

  app.route('/clubId/:id')
    .get(clubController.getClubById);

  app.route('/clubName/:clubName')
    .get(clubController.getClubByName); //returns club's info

  app.route('/clubArenas')
    .get(clubController.getClubArenas); //return all the arenas in a club

  app.route('/club/updateCoach')
    .post(clubController.updateCoach);

  app.route('/club/coaches/:clubId')
    .get(clubController.getCoachByClubId);

  app.route('/club/athletes/:clubId')
    .get(clubController.getClubAthletes);

  //---------------------------------GROUP---------------------------------

  //---------------------------------HORSE---------------------------------
  app.route('/horse')
    .post(horseController.addHorse);

  app.route('/getSchoolHorses/:clubId')
    .get(horseController.getScholasticHorses);

  app.route('/horse/:horseId')
    .get(horseController.getHorseInfos);

  app.route('/removeHorses')
    .delete(horseController.removeHorse);

  app.route('/horses/:clubId')
    .get(horseController.getHorses);

  app.route('/privateHorses/:ownerId')
    .get(horseController.getPrivateHorses);

  app.route('/updateHorse')
    .post(horseController.updateHorse)

  //---------------------------------LESSON---------------------------------
  app.route('/lesson')
    .post(lessonController.createLesson);

  app.route('/lesson/:clubId')
    .get(lessonController.getLessonByClubID);

  app.route('/removelesson/:clubId')
    .delete(lessonController.deleteLesson);

  app.route('/lesson/getInfo/:clubId')
    .get(lessonController.getLessonsInfos);

  app.route('/lesson/update')
    .post(lessonController.updateLesson);

  //---------------------------------USER---------------------------------
  app.route('/login')
    .post(loginController.login);

  app.route('/signup')
    .post(signupController.signup);

  app.route('/addTemporary')
    .post(signupController.signupTemporary);

  app.route('/user/roles/:id')
    .get(userController.getUserRoles)

  app.route('/user/roles')
    .post(userController.addRole)

  app.route('/user/removeRole')
    .delete(userController.removeRole);

  app.route('/user/updateUser')
    .post(userController.updateUser);

  app.route('/user/:clubId')
    .get(userController.getUsersByClub);

  app.route('/user')
    .delete(userController.removeUser);

  app.route('/userinfo/:userId')
    .get(userController.getUserById);

  app.route('/userhorse/:userId')
    .get(userController.getUserHorses);

  //---------------------------NOTIFICATION---------------------------------

  app.route('/notification')
    .post(notificationController.addNotification)

  app.route('/notification/:recipientId')
    .get(notificationController.getUserNotifications)
}
