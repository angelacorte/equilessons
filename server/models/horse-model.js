const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let HorseSchema = new Schema({
  horseName: {type: String, required:true},
  breed: {type: String, required:true}, //TODO look for a database or smth in which there are all breeds
  microchip: {type:Number, required:true, unique:true},
  nrFise: {type:String, unique:true},
  nrFEI: {type:String, unique:true},
  owner: [{type:Schema.Types.ObjectId, ref:"User"}], //refers to an user
  clubId: {type:Schema.Types.ObjectId, ref:"Club"}, //object/reference of 'club model'
  birthday: {type:Date, required:true},
  provenience: {type: String, required:true}, //TODO must be an existing country
  rider: [{type:Schema.Types.ObjectId, ref:"User"}],
  scholastic: {type:Boolean, default:false} //if true means that the horse can do school lessons
});

module.exports = mongoose.model("Horse", HorseSchema, 'horses');
