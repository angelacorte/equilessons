const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  club: {type: String, required: true}
});

userSchema.set(`toJson`,{
  virtuals: true,
  versionkey: false,

});

module.exports = mongoose.model("User", userSchema);
