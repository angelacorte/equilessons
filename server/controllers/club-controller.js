const db = require("../models");
let Club = db.club;
let User = db.user;

let jwt = require("jsonwebtoken");
require('dotenv').config();

let ObjectId = require('mongodb').ObjectID;

/**
 * Create new access token for club login
 * @param clubId
 * @return {*}
 */
function generateAccessToken(clubId){
  return jwt.sign({clubId}, process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: '365d' // expires in 1 year
  }, function (err, token) {
    console.log(err);
  })
}

/**
 * Authenticate a club on login
 * @param req
 * @param res
 */
exports.clubLogin = function (req,res) { //TODO manage errors
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

/**
 * Used for authentication, check if a token is valid
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
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

/**
 * Create new token
 * @param req
 * @param res
 * @return {*}
 */
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
      return res.sendStatus(404).json({"description":"no token found"});
    }
    res.sendStatus(204);
  }).catch(err => {
    console.log("Error: ", err.message);
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
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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
    console.log("Error: ", err.message);
  });
}

/**
 * Get all arenas of a club
 * @param req
 * @param res
 */
exports.getClubArenas = function (req,res) { //TODO maybe it's a duplicate, the other one is in arena-controller
  Club.aggregate([{$match:{"_id": req.params.id}},{$lookup:{from:"arenas",localField:"_id",foreignField:"clubId",as:"arenasInClub"}}]).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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

/**
 * Add new coach to the club
 * @param req
 * @param res
 */
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
  User.find({"clubId":req.params.clubId}, {name:1, surname:1, horse:1, email:1, phoneNumber:1}).sort(sort).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
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
        'clubCoaches._id': 1
      }
    }
  ];

  Club.aggregate(pipeline).sort(sort).then(result=>{
    if(!result){
      return res.status(500).send({message: "an error occurred"});
    }
    return res.send(result);
  }).catch(err=> {
    console.log("Error: ", err.message);
  });
}
