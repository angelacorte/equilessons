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
      res.send({status: 500, message: 'an error occurred'});
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
  Lesson.deleteOne({_id: req.params.clubId}).then(result=>{
    if(result.deletedCount > 0){
      return res.send({status: 200, message:"OK"});
    }else{
      return res.send({status: 400, message: "bad request"});
    }
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
};

/**
 * Update a specific lesson
 * @param req
 * @param res
 */
exports.updateLesson = function (req,res){
  let update = {
    beginDate: req.body.beginDate,
    endDate: req.body.endDate,
    arenaId: req.body.arenaId,
    coachId: req.body.coachId,
    clubId: req.body.clubId,
    pairs: req.body.pairs,
    notes: req.body.notes
  };

  Lesson.updateOne({_id: new ObjectId(req.body.lessonId)}, update).then(result=>{
    if(result.modifiedCount > 0){
      return res.send({status:200});
    }else{
      return res.send({status:500});
    }
  })
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
      return res.send({status: 500, message: "an error occurred"});
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

  Lesson.aggregate(pipeline).then(async result => {
    if (!result) {
      return res.send({status: 500, message: "an error occurred"});
    }
    let lesson = await matchPairs(result)
    return res.send(lesson);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

async function matchPairs(lessons) {
  let newLessons = []
  lessons.forEach(l => {
    let pairs = l['pairs'];
    let riders_in_lesson = l['riders_in_lesson'];
    let horses_in_lesson = l['horses_in_lesson'];

    let lessonRefactored = {
      lessonId: l._id,
      beginDate: l.beginDate,
      endDate: l.endDate,
      arena: l.arena[0], //could be arena[0]
      coach: {
        _id: l.coach[0]['_id'],  //could be coach[0]
        name: l.coach[0]['name'], //could be coach[0]
        surname: l.coach[0]['surname']  //could be coach[0]
      },
      pairs: [],
      notes: l.notes
    };

    pairs.forEach((value)=>{
      riders_in_lesson.forEach(rider =>{
        if(rider._id.toString() === value.riderId.toString()){
          let riderInfo = {
            riderId: rider._id,
            riderName:rider.name,
            riderSurname:rider.surname
          }
          horses_in_lesson.forEach(horse =>{
            if(horse._id.toString() === value.horseId.toString()){
              let horseInfo = {
                horseId: horse._id,
                horseName: horse.horseName
              }
              let couple = {
                riderInfo: riderInfo,
                horseInfo: horseInfo
              }
              lessonRefactored.pairs.push(couple);
            }
          })
        }
      })
    })
    newLessons.push(lessonRefactored)
  })

  return newLessons;
}

