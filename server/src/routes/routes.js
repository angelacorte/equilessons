const arenaController = require("../controllers/arena-controller");
const clubController =require("../controllers/club-controller");
const horseController = require("../controllers/horse-controller");
const lessonController = require("../controllers/lesson-controller");
const loginController = require("../controllers/login-controller");
const signupController = require("../controllers/signup-controller");
const userController = require("../controllers/user-controller");
const notificationController = require("../controllers/notification-controller")

module.exports = function (app){

  // Authorized POST requests for logging in and signing up
  app.route('/club/login')
    .post(clubController.clubLogin);

  app.route('/login')
    .post(loginController.login);

  app.route('/signup')
    .post(signupController.signup);

  app.route('/addTemporary')
    .post(signupController.signupTemporary);

  // Filter out unauthorized POST and DELETE requests
  app.route('/*').post(loginController.authenticate,)
  app.route('/*').delete(loginController.authenticate,)

  //---------------------------------ARENA---------------------------------
  app.route('/arenaName/:arenaName')
    .get(arenaController.getArenaByName);

  app.route('/arena/:clubId')
    .get(arenaController.getArenasByClubId);

  app.route('/arena')
    .post(arenaController.addArena);

  app.route('/arena')
    .delete(arenaController.removeArena);

  //---------------------------------CLUB---------------------------------
  app.route('/club')
    .get(clubController.getAllClubs)
    .post(clubController.registerClub)

  app.route('/clubId/:id')
    .get(clubController.getClubById);

  app.route('/clubName/:clubName')
    .get(clubController.getClubByName);

  app.route('/clubArenas')
    .get(clubController.getClubArenas);

  app.route('/club/updateCoach')
    .post(clubController.updateCoach);

  app.route('/club/coaches/:clubId')
    .get(clubController.getCoachByClubId);

  app.route('/club/athletes/:clubId')
    .get(clubController.getClubAthletes);

  //---------------------------------HORSE---------------------------------
  app.route('/horse')
    .post(horseController.addHorse);

  app.route('/getSchoolHorses/:clubId')
    .get(horseController.getScholasticHorses);

  app.route('/horse/getOwner/:horseId')
    .get(horseController.getHorseOwner)

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

  app.route('/lesson/:lessonId')
    .get(lessonController.getLesson)

  app.route('/lesson/coach/:coachId')
    .get(lessonController.getLessonByCoachID);

  app.route('/removelesson/:clubId')
    .delete(lessonController.deleteLesson);

  app.route('/lesson/getInfo/:clubId')
    .get(lessonController.getLessonsByClubID);

  app.route('/lesson/update')
    .post(lessonController.updateLesson);

  app.route('/lesson/user/:userId')
    .get(lessonController.getLessonByUserID)

  //---------------------------------USER---------------------------------
  app.route('/user/roles/:id')
    .get(userController.getUserRoles)

  app.route('/user/roles')
    .post(userController.addRole)

  app.route('/user/removeRole')
    .delete(userController.removeRole);

  app.route('/user/updateUser')
    .post(userController.updateUser);

  app.route('/user')
    .delete(userController.removeUser);

  app.route('/userinfo/:userId')
    .get(userController.getUserById);

  app.route('/userhorse/:userId')
    .get(userController.getUserHorses);

  app.route('/user/add-horse')
    .post(userController.addHorse)

  app.route('/user/remove-horse')
    .delete(userController.removeHorse)

  //---------------------------NOTIFICATION---------------------------------
  app.route('/notification')
    .post(notificationController.addNotification)

  app.route('/notification/:recipientId')
    .get(notificationController.getUserNotifications)

  app.route('/notification/delete/:notificationId')
    .get(notificationController.deleteNotification)
}
