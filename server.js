const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io");
const bodyParser  = require("body-parser");
const port = 5000;
const socket = io(http);

const connect = require("./dbConnection");
const Chat = require("./models/chatSchema");
const chatRouter  = require("./routes/chatRoute");

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chat", chatRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//setup event listener
socket.on("connection", socket => {
  console.log("User connected...");
  socket.on("disconnect", function() {
    console.log("User disconnected...");
  });

  socket.on("newMessage", (msg) => {
    console.log(`${msg.sender} says(${msg.room}): ${msg.message}`);
    socket.broadcast.emit("received", msg);

    //save chat to DB
    connect.then(db => {
      
      //new document
      let chatMessage = new Chat({ message: msg.message, sender: msg.sender, room: msg.room });
      chatMessage.save();
      //console.log("- message saved to database");
    });
  });
});

//wire up the server to listen to our port 500
http.listen(port, () => {
  console.log("connected to port: " + port);
});
