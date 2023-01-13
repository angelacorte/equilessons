const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

/**
 * Schema of a group for mongodb
 */
let GroupSchema = new Schema({
  name: {type: String, required: true},
  participants: [{type:Schema.Types.ObjectId, ref:"User"}],
  maxComponents: {type: Number, required: true},
  colorHEX: {type: String, default: '#8cd3ff'},
  club: {type:Schema.Types.ObjectId, ref:"Club"} //object/reference of 'club model'
});

module.exports = mongoose.model("Group", GroupSchema, 'groups');
