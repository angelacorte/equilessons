const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let ObjectId = require('mongodb').ObjectID;


exports.createLesson = function (req,res){
  let newLesson = new Lesson(req.body);
  newLesson.save(function(err, user) {
    if (err){
      res.send(err);
    }
    res.status(200).json(user);
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

exports.getLessonInfo = function (req,res){ //may needs req.query

};

exports.getLessonByUserID = function (req,res){

}

exports.getLessonByArenaID = function (req,res){

}

exports.getLessonByClubID = function (req,res){
  Lesson.find({"clubId": req.params.clubId}).sort({beginDate:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    console.log("getLessonByClubID", result);
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getLessonByDate = function (req,res){

}

exports.getLessonByCoachID = function (req,res){

}

exports.getLessonsInfos = function (req,res) {

  let pipeline = [
    {
      $match: {
        "clubId": new ObjectId(req.params.clubId)
      }
    },
     {
      $lookup: {
        from: 'horses',
        localField: 'pairs.horseId',
        foreignField: '_id',
        as: 'horses_in_lesson'
      }
    }, {
      $lookup: {
        from: 'users',
        localField: 'pairs.riderId',
        foreignField: '_id',
        as: 'riders_in_lesson'
      }
    }, {
      $lookup: {
        from: 'arenas',
        localField: 'arenaId',
        foreignField: '_id',
        as: 'arena'
      }
    }, {
      $lookup: {
        from: 'users',
        localField: 'coachId',
        foreignField: '_id',
        as: 'coach'
      }
    }, {
      $project: {
        'riders_in_lesson._id': 1,
        'riders_in_lesson.name': 1,
        'riders_in_lesson.surname': 1,
        'horses_in_lesson.horseName': 1,
        'horses_in_lesson._id': 1,
        'arena.arenaName': 1,
        'coach._id':1,
        'coach.name': 1,
        'coach.surname': 1,
        'beginDate': 1,
        'endDate': 1,
        'pairs': 1
      }
    }
  ];

  Lesson.aggregate(pipeline).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
