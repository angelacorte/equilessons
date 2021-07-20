const db = require("../models");
let Arena = db.arena;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

exports.createLesson = function (req,res){   //TODO add the coach who create the lesson, might be managed with sessions and authentication (tokens)
  let lesson = req.body;
  Lesson.insertOne(lesson).then(result=>{
    res.status(200).send({message:"Lesson created successfully"});
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

exports.deleteLesson = function (req,res){     //TODO might send a notification to the participants who were listed into
  let lesson = req.body;
  Lesson.deleteOne({_id:lesson._id}).then(result=>{
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
