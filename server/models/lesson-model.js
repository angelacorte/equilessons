const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let  LessonSchema = new Schema({
  begins: {type: Date, required:true},
  ends: {type: Date, required:true},
  arenaId: {type: Schema.Types.ObjectId, ref:"Arena", required:true},
  coachId: {type:Schema.Types.ObjectId, ref:"User"}, //refers to user coach
  participants: [{
    riderId: {type:Schema.Types.ObjectId, ref:"User"},
    horseId: {type:Schema.Types.ObjectId, ref:"Horse"}
  }],
  //maxComponents: {type: Number, required: true},
  club: {type:Schema.Types.ObjectId, ref:"Club"} //object/reference of 'club model'
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
