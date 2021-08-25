const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let ClubSchema = new Schema({
  clubName: {type:String, unique:true, required:true},
  clubEmail: {type:String, unique:true, required:true},
  clubTelephone:{type:Number, unique:true, required:true},
  clubCity: {type: String, required: true},
  clubAddress: {type: String, required: true},
  clubOwnerId:{type:Schema.Types.ObjectId, ref:"User", required:true},
  clubCoach:[{type:Schema.Types.ObjectId, ref:"User"}]
});

module.exports = mongoose.model("Club", ClubSchema, "clubs");
