const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories")
const multer = require("multer");
const cors = require("cors");
const path = require("path");
//socket.io
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server)

dotenv.config();
app.use(express.json());
app.use(cors())
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch((err)=>{console.log(err)});

const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, "images")
  },
  filename:(req, file, cb)=>{
    cb(null, req.body.name)
  },
})

const uplod = multer({storage:storage})
app.post("/api/upload", uplod.single("file"), (req, res)=>{
  res.status(200).json("File hab been uploaded")
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

io.on("connection",(socket)=>{
  console.log('a user connected',socket.id);
})

server.listen(5000, () => {
  console.log("Backend is running.");
});

// app.listen(5000, () => {
//   console.log("Backend is running.");
// });