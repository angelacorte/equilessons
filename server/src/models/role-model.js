const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let RoleSchema = new Schema({
  role: {type:String, required: true},
})

module.exports = mongoose.model("Role", RoleSchema, "roles");
