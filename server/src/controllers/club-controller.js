const db = require("../models");
let Club = db.club;
let User = db.user;

let jwt = require("jsonwebtoken");
const {generateAccessToken} = require("../utils/controller-utils");
require('dotenv').config();

let ObjectId = require('mongodb').ObjectID;

/**
 * Authenticate a club on login
 * @param req
 * @param res
 */
exports.clubLogin = function (req,res) {
  Club.getAuthenticated(req.body.clubEmail, req.body.clubPassword, async function (err, club, reason) {
    if (err) {
      res.send({status: 500, message: "an error occurred", error: err})
    }
    if (club) {
      const accessToken = await generateAccessToken(club._id);
      const refreshToken = jwt.sign(JSON.stringify(club._id), `${process.env.REFRESH_TOKEN_SECRET}`);

      const filter = {"_id": club._id};
      const update = {"token": refreshToken};

      Club.findOneAndUpdate(filter, update, {
        new: true,
        projection: {
          'clubPassword': 0
        }
      },).then(clubRes => {
        if (!clubRes) {
          res.send({status: 400, accessToken: accessToken, refreshToken: refreshToken});
        } else {
          res.send({status: 200, accessToken: accessToken, refreshToken: refreshToken, club: clubRes});
        }
      })
    }

    let reasons = Club.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.send({status: 404, description: "incorrect username or password"});
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.send({status: 401, description: "incorrect username or password"});
        break;
    }
  });
}

/**
 * Club logout, remove access token
 * @param req
 * @param res
 */
exports.logout = function (req,res) {
  const filter = { "token": req.body.token};
  const update = { "token": ""};

  Club.findOneAndUpdate(filter, update,{
    new:true
  }).then(result =>{
    if(!result){
      return res.send({status: 404, "description":"no token found"});
    }else{
      res.send({status: 200});
    }
  }).catch(err => {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}

/**
 * Get all clubs that have subscribed the platform
 * @param req
 * @param res
 */
exports.getAllClubs = function (req,res) {
  Club.find({},{_id:1,clubName:1}).then(result =>{
    if(!result){
      return res.send({status: 400,message: "an error occurred"});
    }else{
      return res.send({status: 200, clubs: result})
    }
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}

/**
 * Get club's infos based on its name
 * @param club
 * @param req
 * @param res
 */
exports.getClubByName = function (club, req,res){
  let clubN;
  if(req !== undefined){
    clubN = req.params.clubName;
  }else if(club){
    clubN = club;
  }
  Club.findOne({"clubName": clubN}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});
  });
}

/**
 * Get club's infos based on its ID
 * @param req
 * @param res
 */
exports.getClubById = function (req,res){
  Club.findOne({"_id":new ObjectId(req.params.id)}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    return res.send({status: 500, message: "an error occurred", error: err});

  });
}

/**
 * Add new club to the database
 * @param req
 * @param res
 */
exports.registerClub = function (req,res) {
  Club.findOne({clubEmail:req.body.clubEmail}).then(tmpClub=>{
    if(tmpClub){
      res.send({status: 409, description: "email already in use"})
    }else{
      let newClub = new Club(req.body);
      newClub.save(function (err, club) {
        if (err) {
          res.send({status: 400, message: "error while saving club"})
        }else{
          delete club.clubPassword //todo pare non worki
          return res.send({status: 200, message: "club added", club});
        }
      })
    }
  }).catch(err=> {
    res.send({status: 500, message: "an error occurred", error: err})
  });
}

/**
 * Add new coach to the club
 * @param req
 * @param res
 */
exports.updateCoach = function (req, res){
  Club.updateOne({_id:req.body.clubId},{clubCoach: req.body.coaches}).then(result=>{
    if(result.modifiedCount > 0){
      return res.send({status: 200});
    }else{
      return res.send({status: 400, message: "Bad request"});
    }
  }).catch(err=> {
    return res.send({status: 500, message: "Error ", error: err});
  });
}
/**
 * Get all people that have subscribed to a certain club (by clubs ID)
 * @param req
 * @param res
 */
exports.getClubAthletes = function (req,res) {
  let sort = {
    surname: 1,
    name: 1
  };
  User.find({"clubId":req.params.clubId}, {name:1, surname:1, horse:1, email:1, phoneNumber:1, clubId: 1}).sort(sort).then(result=>{
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }
    return res.send(result);
  }).catch(err=> {
    return res.send({status: 500, message: "Error ", error: err});
  });
}

//db.users.aggregate([{$match:{"clubId":ObjectId("60f702d3329ccb26f26937a0"), "roles":"coach"}}])
/**
 * Get all the coach of a club, by clubs ID
 * @param req
 * @param res
 */
exports.getCoachByClubId = function (req,res) {

  let sort = {
    surname: 1,
    name: 1
  };
  let pipeline = [
    {
      '$match': {
        '_id': new ObjectId(req.params.clubId)
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'clubCoach',
        'foreignField': '_id',
        'as': 'clubCoaches'
      }
    }, {
      '$project': {
        'clubCoaches.name': 1,
        'clubCoaches.surname': 1,
        'clubCoaches._id': 1,
        '_id': 0
      }
    }
  ];

  Club.aggregate(pipeline).sort(sort).then(result=>{
    if(!result){
      return res.send({status: 400, message: "Bad request"});
    }
    return res.send({status: 200, coaches: result[0].clubCoaches});
  }).catch(err=> {
    return res.send({status: 500, message: "Error ", error: err});
  });
}
