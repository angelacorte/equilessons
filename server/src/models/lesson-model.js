const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

/**
 * Schema of a lesson for mongodb
 */
let  LessonSchema = new Schema({
  beginDate: {type: Date, required:true},
  endDate: {type: Date, required:true},
  arenaId: {type: Schema.Types.ObjectId, ref:"Arena", required:true},
  coachId: {type:Schema.Types.ObjectId, ref:"User", required: true},
  pairs: [{
    riderId: {type:Schema.Types.ObjectId, ref:"User"},
    horseId: {type:Schema.Types.ObjectId, ref:"Horse"}
  }],
  clubId: {type:Schema.Types.ObjectId, ref:"Club", required: true},
  notes: {type: String, default:"Non ci sono note dell'istruttore."}
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
