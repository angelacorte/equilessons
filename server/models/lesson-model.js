const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let  LessonSchema = new Schema({
  beginDate: {type: Date, required:true},
  endDate: {type: Date, required:true},
  arenaId: {type: Schema.Types.ObjectId, ref:"Arena", required:true},
  coachId: {type:Schema.Types.ObjectId, ref:"User"}, //refers to user coach
  pairs: [{
    riderId: {type:Schema.Types.ObjectId, ref:"User"},
    horseId: {type:Schema.Types.ObjectId, ref:"Horse"}
  }],
  //maxComponents: {type: Number, required: true},
  clubId: {type:Schema.Types.ObjectId, ref:"Club"} //object/reference of 'club model'
  //color: {type: String}
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
