const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

exports.createLesson = function (req,res){   //TODO add the coach who create the lesson, might be managed with sessions and authentication (tokens)
  let newLesson = new Lesson(req.body);
  //lesson.coach =
  newLesson.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(201).json(user);
  });
};

exports.deleteLesson = function (req,res){     //TODO might send a notification to the participants who were listed into
  Lesson.deleteOne({_id:req.params._id}).then(result=>{
    res.status(200).send({message:"Lesson deleted"});
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

exports.updateLesson = function (req,res){

};

exports.getLessonInfo = function (req,res){

};

exports.getLessonByUserID = function (req,res){

}

exports.getLessonByArenaID = function (req,res){

}

exports.getLessonByClubID = function (req,res){

}

exports.getLessonByDate = function (req,res){

}

exports.getLessonByCoachID = function (req,res){

}

/*exports. = function (req,res){

}*/
