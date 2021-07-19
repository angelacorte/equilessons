const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let HorseModel = new Schema({
  name: {type: String, required:true},
  breed: {type: String, required:true}, //TODO look for a database or smth in which there are all breeds
  microchip: {type:Number, required:true, unique:true},
  nrFise: {type:Number, unique:true},
  nrFEI: {type:Number, unique:true},
  owner: {type:String, required:true}, //TODO must refere to an user
  club: {type: String, required:true}, //TODO must be object/reference of 'club model'
  birthday: {type:Number, required:true},
  provenience: {type: String, required:true}, //TODO must be a country
  rider: {type:Array}
});
