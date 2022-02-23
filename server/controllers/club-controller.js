const db = require("../models");
let Arena = db.arena;
let Club = db.club;
let Group = db.group;
let Horse = db.horse;
let Lesson = db.lesson;
let Role = db.role;
let User = db.user;

let jwt = require("jsonwebtoken");
require('dotenv').config();

let ObjectId = require('mongodb').ObjectID;

function generateAccessToken(clubId){
  return jwt.sign({clubId}, process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: '365d' // expires in 1 year
  }, function (err, token) {
    console.log(err);
  })
}

exports.clubLogin = function (req,res) {
  Club.getAuthenticated(req.body.clubEmail, req.body.clubPassword, function (err, club, reason) {
    if (err) {
      throw err;
    }
    if (club) {
      const accessToken = generateAccessToken(club._id);
      const refreshToken = jwt.sign(JSON.stringify(club._id), process.env.REFRESH_TOKEN_SECRET, { algorithm: 'RS256' }, function (err, token){console.log(err)});

      const filter = {"_id": club._id};
      const update = {"token": refreshToken};

      Club.findOneAndUpdate(filter, update, {
        new: true
      }, ).then(result => {
        if (!result) {
          res.status(500).json({"accessToken": accessToken, "refreshToken": refreshToken});
        }
        res.status(200).json({"accessToken": accessToken, "refreshToken": refreshToken, "club": club});
      }).catch(err => {
        console.log("Error: ", err.message);
      });
    }

    let reasons = Club.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.status(401).json({"description": "incorrect username or password"});
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.status(401).json({"description": "incorrect username or password"});
        break;
      /*case reasons.MAX_ATTEMPTS:
        // send email or otherwise notify user that account is
        // temporarily locked
        res.status(401).json({"description": "you have been locked"});
        break;*/
    }
  });
}

exports.authenticate = function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] //takes the token if exists

  if(token == null || typeof token === undefined){
    return res.status(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,club)=>{
    if(err){
      console.log("TOKEN: ", + token);
      console.log(err);
      return res.sendStatus(403);
    }

    Club.findById(club.clubId, function (err,club){
      if(err){
        return res.sendStatus(500);
      }
      console.log(club)
      if(!club){
        return res.sendStatus(404);
      }
      req.club = club;
      next();
    }).catch(err => {
      console.log("Error: ", err.message);
    });
  })
}

exports.token = function (req,res){
  const refreshToken = req.body.token;
  if(refreshToken == null){
    return res.sendStatus(401);
  }
  Club.findOne({"token":refreshToken}, function (err,doc) {
    if(err){
      return res.sendStatus(500);
    }
    if(doc == null){
      return res.sendStatus(403);
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,club)=>{
      if(err){
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({"name": club.clubName});
      return res.json({"accessToken":accessToken});
    })
  }).catch(err => {
    console.log("Error: ", err.message);
  });
}

exports.logout = function (req,res) {
  const filter = { "token": req.body.token};
  const update = { "token": ""};

  Club.findOneAndUpdate(filter, update,{
    new:true
  }).then(result =>{
    if(!result){
      return res.sendStatus(404).json({"description":"no token found"});
    }
    res.sendStatus(204);
  }).catch(err => {
    console.log("Error: ", err.message);
  });
}

exports.getAllClubs = function (req,res) {
  Club.find({},{_id:1,clubName:1}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubByName = function (club, req,res){
  let clubN;
  console.log("club ", club)
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
    console.log("Error: ", err.message);
  });
}

exports.getClubById = function (req,res){
  Club.findOne({"_id":new ObjectId(req.params.id)}).then(result =>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubArenas = function (req,res) { //gets all the arenas in a club
  Club.aggregate([{$match:{"_id": req.params.id}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasInClub"}}]).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.registerClub = function (req,res) {
  Club.findOne({
    clubEmail:req.body.clubEmail
  }).then(tmpClub=>{
    if(tmpClub){
      res.status(409).send({"description": "email already in use"})
    }else{
      let newClub = new Club(req.body);
      newClub.save(function(err, club) {
        if (err){
          res.send(err);
        }
        res.status(200).json(club);
      });
    }
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.addCoach = function (req,res){
  Club.updateOne({_id:req.body.clubId},{clubCoach: req.body.coaches}).then(result=>{
    if(result.ok !== 1){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

exports.getClubAthletes = function (req,res) {
  User.find({"clubId":req.params.clubId}, {name:1, surname:1, horse:1, email:1, phoneNumber:1}).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

//db.users.aggregate([{$match:{"clubId":ObjectId("60f702d3329ccb26f26937a0"), "roles":"coach"}}])
exports.getCoachByClubId = function (req,res) {

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
        'clubCoaches._id': 1
      }
    }
  ];

  Club.aggregate( pipeline).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}

/*
db.arenas.aggregate([{ $match:{"clubId":ObjectId("60f702d3329ccb26f26937a0")}},{$lookup:{from:"clubs",localField:"clubId",foreignField:"_id",as:"arenasClub

//this finds all the arenas that a club has:
//db.clubs.aggregate([{ $match:{"_id":ObjectId("60f702d3329ccb26f26937a0")}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasClub"}}])

{ $match:"}}])
  {
    "_id":ObjectId("60f702d3329ccb26f26937a0")
  }
},{$lookup:{
  from:"arenas",
    localField:"clubId",
    foreignField:"_id",
    as:"arenasClub"
}}
*/
