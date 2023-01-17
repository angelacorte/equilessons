const { ObjectID } = require("mongodb");
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
      res.send({status: 400, message: 'an error occurred'});
    }else{
      res.send({status: 200, lesson: lesson})
    }
  });
};

/**
 * Delete lesson from db
 * @param req
 * @param res
 */
exports.deleteLesson = function (req,res){
  Lesson.deleteOne({_id: req.params.clubId}).then(result=>{
    if(result.deletedCount > 0){
      return res.send({status: 200, message:"OK"});
    }else{
      return res.send({status: 400, message: "bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
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

exports.getLesson = async (req, res) => {
  let pipeline = [
    {
      $match: {
        '_id': new ObjectId(req.params.lessonId)
      }
    }, {
      $lookup: {
        from: 'users',
        localField: 'coachId',
        foreignField: '_id',
        as: 'coach'
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
        localField: 'pairs.riderId',
        foreignField: '_id',
        as: 'riders_in_lesson'
      }
    }, {
      $lookup: {
        from: 'horses',
        localField: 'pairs.horseId',
        foreignField: '_id',
        as: 'horses_in_lesson'
      }
    }, {
      $project: {
        'coach.name': 1,
        'coach.surname': 1,
        'coach._id': 1,
        'notes': 1,
        'endDate': 1,
        'beginDate': 1,
        'arena._id': 1,
        'arena.arenaName': 1,
        'pairs': 1,
        'riders_in_lesson._id': 1,
        'riders_in_lesson.name': 1,
        'riders_in_lesson.surname': 1,
        'horses_in_lesson._id': 1,
        'horses_in_lesson.horseName': 1
      }
    }
  ]
  Lesson.aggregate(pipeline).then(r => {
    if (!r){
      res.send({status:400})
    }else{
      let lesson = matchAll(r)
      res.status(200).send(lesson[0])
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}


/**
 * Get all the lessons where a specific user is signed to
 * @param req
 * @param res
 */
exports.getLessonByUserID = function (req,res){
  let pipeline = [{
    $match: {
      'pairs.riderId': new ObjectId(req.params.userId)}
    },{
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
      as: 'coach'}
    }, {
    $project: {
      'arena.arenaName': 1,
      'arena._id': 1,
      'coach._id': 1,
      'coach.name': 1,
      'coach.surname': 1,
      'beginDate': 1,
      'endDate': 1,
      'notes': 1}
  }]
  Lesson.aggregate(pipeline).then(lessons => {
    if(lessons){
      let lessonsRefactored = []
      lessons.forEach(l => {
        let lr = {
          lessonId: l._id,
          beginDate: l.beginDate,
          endDate: l.endDate,
          arena: l.arena[0],
          coach: {
            _id: l.coach[0]['_id'],
            name: l.coach[0]['name'],
            surname: l.coach[0]['surname']
          },
          notes: l.notes
        };
        lessonsRefactored.push(lr)
      })
      res.send({status:200, lesson: lessonsRefactored})
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}

/**
 * Get all lessons assigned to a coach by its ID
 * @param req
 * @param res
 */
exports.getLessonByCoachID = function (req,res){
  let pipeline = [
    {
      $match: {
        'coachId': new ObjectId(req.params.coachId)
      }
    }, {
      $lookup: {
        'from': 'arenas',
        'localField': 'arenaId',
        'foreignField': '_id',
        'as': 'arena'
      }
    }, {
      $lookup: {
        'from': 'horses',
        'localField': 'pairs.horseId',
        'foreignField': '_id',
        'as': 'horses_in_lesson'
      }
    }, {
      $lookup: {
        'from': 'users',
        'localField': 'pairs.riderId',
        'foreignField': '_id',
        'as': 'riders_in_lesson'
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
        'beginDate': 1,
        'endDate': 1,
        'pairs': 1,
        'notes': 1
      }
    }
  ]
  Lesson.aggregate(pipeline).then(result => {
    if(result){
      let lessons = matchNoCoach(result)
      return res.send({status: 200, lessons: lessons});
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, error: err});
  });
}

/**
 * Get all the infos of a lesson by its id
 * @param req
 * @param res
 */
exports.getLessonsByClubID = function (req,res) {
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
      return res.send({status: 400, message: "Bad request"});
    }else{
      let lessons = matchAll(result)
      return res.send({status: 200, lessons: lessons});
    }
  }).catch(err=> {
    return res.send({status: 500, error: err});
  });
}

function matchNoCoach(lessons){
  let newLessons = []
  lessons.forEach(l => {
    let lessonRefactored = {
      lessonId: l._id,
      beginDate: l.beginDate,
      endDate: l.endDate,
      arena: l.arena[0], //could be arena[0]
      pairs: [],
      notes: l.notes
    };
    lessonRefactored.pairs = matchPairs(l['pairs'], l['riders_in_lesson'], l['horses_in_lesson'])
    newLessons.push(lessonRefactored)
  })
  return newLessons;
}

function matchAll(lessons){
  let newLessons = []
  lessons.forEach(l => {
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
    lessonRefactored.pairs = matchPairs(l['pairs'], l['riders_in_lesson'], l['horses_in_lesson'])
    newLessons.push(lessonRefactored)
  })
  return newLessons;
}

function matchPairs(pairs, riders, horses) {
  let couples = []
  pairs.forEach((value)=>{
    riders.forEach(rider =>{
      if(rider._id.toString() === value.riderId.toString()){
        let riderInfo = {
          riderId: rider._id,
          riderName:rider.name,
          riderSurname:rider.surname
        }
        horses.forEach(horse =>{
          if(horse._id.toString() === value.horseId.toString()){
            let horseInfo = {
              horseId: horse._id,
              horseName: horse.horseName
            }
            let couple = {
              riderInfo: riderInfo,
              horseInfo: horseInfo
            }
            couples.push(couple);
          }
        })
      }
    })
  })
  return couples
}
