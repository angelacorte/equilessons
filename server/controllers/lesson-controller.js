const db = require("../models");
let Lesson = db.lesson;

let ObjectId = require('mongodb').ObjectID;

/**
 * Create new lesson
 * @param req
 * @param res
 */
exports.createLesson = function (req,res){
  let newLesson = new Lesson(req.body);
  newLesson.save(function(err, lesson) {
    if (err){
      res.send(err);
    }
    res.status(200).json(lesson);
  });
};

/**
 * Delete lesson from db
 * @param req
 * @param res
 */
exports.deleteLesson = function (req,res){     //TODO might send a notification to the participants who were listed into
  Lesson.deleteOne({_id:req.params._id}).then(result=>{
    res.status(200).send({message:"Lesson deleted"});
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

/**
 * Update a specific lesson
 * @param req
 * @param res
 */
exports.updateLesson = function (req,res){ //TODO might send a notification to the participants who were listed into
 let update = {
   beginDate: req.body.beginDate,
   endDate: req.body.endDate,
   arenaId: req.body.arenaId,
   coachId: req.body.coachId,
   clubId: req.body.clubId,
   pairs: req.body.pairs,
   notes: req.body.notes
 };

 Lesson.updateOne({_id: new ObjectId(req.body._id)}, update).then(result=>{
   if(result.ok !== 1){
     return res.status(500).send({message: "an error occurred"});
   }
   return res.send(result);
 }).catch(err=> {
   console.log("Error: ", err.message);
 });
};

/**
 * Get all the lessons where a specific user is signed to
 * @param req
 * @param res
 */
exports.getLessonByUserID = function (req,res){
  //TODO
}

/**
 * Get all lessons signed to a specific arena
 * @param req
 * @param res
 */
exports.getLessonByArenaID = function (req,res){
  //TODO
}

/**
 * Get all lessons of a club
 * @param req
 * @param res
 */
exports.getLessonByClubID = function (req,res){
  Lesson.find({"clubId": req.params.clubId}).sort({beginDate:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/**
 * Get all lessons assigned to a coach by its ID
 * @param req
 * @param res
 */
exports.getLessonByCoachID = function (req,res){
  //TODO
}

/**
 * Get all the infos of a lesson by its id
 * @param req
 * @param res
 */
exports.getLessonsInfos = function (req,res) {

  const sort = {
    "beginDate":1,
    "coach.surname": 1,
    "coach.name": 1,
    'arena.arenaName': 1
  }
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
        'arena._id': 1,
        'coach._id':1,
        'coach.name': 1,
        'coach.surname': 1,
        'beginDate': 1,
        'endDate': 1,
        'pairs': 1,
        'notes': 1
      }
    }
  ];

  Lesson.aggregate(pipeline).sort(sort).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
