const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let GroupSchema = new Schema({
  name: {type: String, required: true},
  partecipants: {type: Array},
  maxComponents: {type: Number, required: true},
  colorHEX: {type: String, default: '#8cd3ff'},
  club: {type: String, required:true} //TODO must be object/reference of 'club model'
});


module.exports = mongoose.model("Group", GroupSchema);
