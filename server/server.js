const express = require("express");
//const cors = require("cors");

const app = express();

/*let corsOptions = {
  origin: "http://localhost:8081"
};
*/

//app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Equilessons" });
});

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
db.mongoose.connect(db.url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("connected to the database SUCCESSFULLY");
}).catch(err=>{
  console.log("connection to the database FAILED ", err);
  process.exit();
});
