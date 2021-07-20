const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let ClubSchema = new Schema({
  clubName: {type:String, unique:true, required:true},
  location: {
    address: {type: String, required: true},
    civic: {type: Number, required: true},
    city: {type: String, required: true},
    postalCode: {type: Number, required: true},
    county: {type: String, required: true},
    country: {type: String, required: true}
  },
  owner:[{type:Schema.Types.ObjectId, ref:"User"}],
});

module.exports = mongoose.model("Club", ClubSchema);
