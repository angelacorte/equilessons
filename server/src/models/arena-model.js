const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

/**
 * Schema of an arena for mongodb
 * @type {Schema | module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
let ArenaSchema = new Schema({
  arenaName:{type: String, required: true},
  clubId: {type: Schema.Types.ObjectId, ref:"Club", required:true}
})

module.exports = mongoose.model("Arena", ArenaSchema, "arenas");
