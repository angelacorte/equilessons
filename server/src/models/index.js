const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.arena = require("./arena-model");
db.club = require("./club-model");
db.group = require("./group-model");
db.horse = require("./horse-model");
db.lesson = require("./lesson-model");
db.role = require("./role-model")
db.user = require("./user-model");

module.exports = db;
