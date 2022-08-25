const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken')
let bodyParser = require("body-parser");
const routes = require('./routes/routes');
const db = require("./models/index")

let corsOptions = {
  origin: "http://localhost:4200"
};


app.use(cors(corsOptions));
/*let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({extended: false});*/

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Equilessons start" });
});

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

routes(app);

db.mongoose.connect(db.url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("connected to the database SUCCESSFULLY");
}).catch(err=>{
  console.log("connection to the database FAILED ", err);
  process.exit();
});
