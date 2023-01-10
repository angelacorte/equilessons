require('dotenv').config()

const cors = require("cors");
let bodyParser = require("body-parser");
const routes = require('./routes/routes');
const db = require("./models/index")

let corsOptions = {
  origin: "http://localhost:4200",
};

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const sockets = require('./utils/socket').sockets

const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Assign a unique ID to each socket when it connects
io.on('connection', (socket) => {
  socket.emit('ask-to-save-info')
  socket.on('save-client-info', (userId) => {
    console.log(`a user connected: ${userId}`);
    sockets.set(userId, socket)
  })
  socket.on('disconnect', ()=>{
    console.log(`a user disconnected`)
  })
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT || 5050;
http.listen(PORT, () => {
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
