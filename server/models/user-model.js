const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
User = require("../models/user-model");

let SALT_WORK_FACTOR = 10;

let UserSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String},
  birthday: {type: Date},
  username: {type: String},
  password: {type: String},
  phoneNumber: {type: Number, required: true, unique:true},
  taxcode: {type:String},
  city: {type: String},
  address: {type: String},
  nrFise : {type: String},
  clubId: {type: Schema.Types.ObjectId, ref:"Club", required: true},
  isOwner: {type: Boolean, default:false},
  roles: {type: Array , default:[]},
  horse: [{type:Schema.Types.ObjectId, ref:"Horse"}], //refers to horses-model
  token : {type: String}
});

UserSchema.pre("save", function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password') && user.password === undefined) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

let reasons = UserSchema.statics.failedLogin = { NOT_FOUND: 0, PASSWORD_INCORRECT: 1, MAX_ATTEMPTS: 2 };

UserSchema.statics.getAuthenticated = function (input, password, cb) {

  User.findOne({
    $or:[
      {username:input},
      {email:input}
    ]
  }, function (err,user) {
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

module.exports = mongoose.model("User", UserSchema, "users");
