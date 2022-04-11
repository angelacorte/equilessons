const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

/**
 * Schema of a lesson for mongodb
 */
let  LessonSchema = new Schema({
  beginDate: {type: Date, required:true},
  endDate: {type: Date, required:true},
  arenaId: {type: Schema.Types.ObjectId, ref:"Arena", required:true},
  coachId: {type:Schema.Types.ObjectId, ref:"User", required: true}, //refers to user coach
  pairs: [{
    riderId: {type:Schema.Types.ObjectId, ref:"User"},
    horseId: {type:Schema.Types.ObjectId, ref:"Horse"}
  }],
  //maxComponents: {type: Number, required: true},
  clubId: {type:Schema.Types.ObjectId, ref:"Club", required: true}, //object/reference of 'club model'
  notes: {type: String, default:"Non ci sono note dell'istruttore."}
  //color: {type: String}
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
