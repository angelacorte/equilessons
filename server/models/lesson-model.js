const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let  LessonSchema = new Schema({
  begins: {type: Date, required:true},
  ends: {type: Date, required:true},
  arena: {type: Schema.Types.ObjectId, ref:"Arena", required:true},
  coach: {type:Schema.Types.ObjectId, ref:"User"}, //refers to user coach
  participants: [{
    rider: {type:Schema.Types.ObjectId, ref:"User"},
    horse: {type:Schema.Types.ObjectId, ref:"Horse"}
  }],
  maxComponents: {type: Number, required: true},
  club: {type:Schema.Types.ObjectId, ref:"Club"} //object/reference of 'club model'
});

module.exports = mongoose.model("Lesson", LessonSchema);
