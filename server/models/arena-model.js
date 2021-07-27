const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let ArenaSchema = new Schema({
  arenaName: {type:String, required: true},
  clubId: {type: Schema.Types.ObjectId, ref:"Club", required:true}
})

module.exports = mongoose.model("Arena", ArenaSchema, "arenas");
