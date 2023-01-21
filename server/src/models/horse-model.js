const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

/**
 * Schema of a horse for mongodb
 */
let HorseSchema = new Schema({
  horseName: {type: String, required:true},
  //breed: {type: String, required:true},
  horseMicrochip: {type:Number, required:true, unique:true},
  horseFise: {type:String}, //todo maybe unique true
  //nrFEI: {type:String, unique:true},
  ownerId: {type:Schema.Types.ObjectId, ref:"User", required: true}, //refers to an user
  clubId: {type:Schema.Types.ObjectId, ref:"Club", required: true}, //object/reference of 'club model'
  horseBirthday: {type:Date},
  //provenience: {type: String, required:true},
  riders: [{type:Schema.Types.ObjectId, ref:"User"}],
  scholastic: {type:Boolean, default:false} //if true means that the horse can do school lessons
});

module.exports = mongoose.model("Horse", HorseSchema, 'horses');
