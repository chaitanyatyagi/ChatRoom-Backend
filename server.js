const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const socket = require("socket.io")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
require("dotenv").config()

app.use(cors())
app.use(express.json())

const DB = process.env.DATABASE
mongooseOptions = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 3,
}

mongoose.set('strictQuery', true)

mongoose.connect(DB, mongooseOptions).then(() => {
    console.log("Database Connected !")
})

mongoose.connection.on("error", (error) => {
    console.log(error)
})

app.use("/api/auth",userRoute)
app.use("/api/messages",messageRoute)

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started at port ${process.env.PORT}`)
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });