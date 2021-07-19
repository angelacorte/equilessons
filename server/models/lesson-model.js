const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let  LessonSchema = new Schema({
  begin: {type: Date, required:true},
  length: {type: Number, required:true},
  arena: {type: String, required:true},
  coach: { type: String, required:true}, //TODO must refere to user coach
  partecipants: {type: Array, required:true}, //must include all the people inside a group or single person
  club: {type: String, required:true} //TODO must be object/reference of 'club model'
});

module.exports = mongoose.model("Lesson", LessonSchema);
