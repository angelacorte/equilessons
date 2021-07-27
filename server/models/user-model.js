const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let SALT_WORK_FACTOR = 10;

let UserSchema = new Schema({
  username: {type: String, unique:true, required: true},
  password: {type: String, required: true},
  hashSalt: {type: String, required: true},
  name: {type: String, required: true},
  surname: {type: String, required: true},
  nrFise : {type: String, unique:true, required: true},
  birthday: {type: Date, required: true},
  phoneNumber: {type: Number, required: true},
  email: {type: String, unique: true, required: true},
  birthLocation: {type: String, required: true},
  taxCode: {type: String, unique: true, required: true},
  location: {
    address: {type: String, required: true},
    civic: {type: Number, required: true},
    city: {type: String, required: true},
    postalCode: {type: Number, required: true},
    county: {type: String, required: true},
    country: {type: String, required: true}
  },
  nationality: {type: String, required: true},
  club: {type: Schema.Types.ObjectId, ref:"Club", required: true},
  roles: [{type: Schema.Types.ObjectId, ref: "Role"}],
  isOwner: {type: Boolean, default:false},
  horse: [{type:Schema.Types.ObjectId, ref:"Horse"}], //refers to horses-model
  token : {type: String}
});

UserSchema.pre("save", function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

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

UserSchema.statics.getAuthenticated = function (usernameOrEmail, password, cb) {
  this.findOne({
    $or:[
      {username:usernameOrEmail},
      {email:usernameOrEmail}
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
