const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let SALT_WORK_FACTOR = 10;

let ClubSchema = new Schema({
  clubName: {type:String, unique:true, required:true},
  clubEmail: {type:String, unique:true, required:true},
  clubPassword:{type:String, required:true},
  clubTelephone:{type:Number, unique:true, required:true},
  clubCity: {type: String, required: true},
  clubAddress: {type: String, required: true},
  //clubOwnerId:{type:Schema.Types.ObjectId, ref:"User", required:true},
  clubCoach:[{type:Schema.Types.ObjectId, ref:"User"}]
});

ClubSchema.pre("save", function (next){
  let club = this;
  // only hash the password if it has been modified (or is new)
  if (!club.isModified('clubPassword')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    bcrypt.hash(club.clubPassword, salt, function(err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      club.clubPassword = hash
      next();
    });
  });
});

ClubSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

let reasons = ClubSchema.statics.failedLogin = { NOT_FOUND: 0, PASSWORD_INCORRECT: 1, MAX_ATTEMPTS: 2 };


ClubSchema.statics.getAuthenticated = function (email, password, cb){
  this.findOne({clubEmail:email}, function (err,user) {
    if(err){
      return cb(err);
    }
    if(!user){
      return  cb(null, null, reasons.NOT_FOUND);
    }

    user.comparePassword(password, function (err,isMatch) {
      if(err){
        return cb(err);
      }
      if(isMatch){
        return cb(null,user);
      }
    })
  })
}

module.exports = mongoose.model("Club", ClubSchema, "clubs");
