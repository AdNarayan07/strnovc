require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");

const {
  emitControllerAssigned,
  emitControllerRevoked,
} = require("./functions");

setInterval(() => {
  const connectedSockets = Array.from(io.sockets.sockets.values());
  if (connectedSockets.length > 0)
    if (
      (!io.admin || !io.sockets.sockets.has(io.admin)) &&
      (!io.controller || !io.sockets.sockets.has(io.controller))
    )
      emitControllerAssigned(io);
}, 1000);

app.use(express.static(path.join(__dirname, "frontend", "public")))
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
);
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "admin.html"))
);

io.on("connection", function (socket) {
  console.log("sm1 joind");
  socket.emit("verifyAdminConnection", !io.admin || !io.sockets.sockets.has(io.admin));
  socket.emit("currentState", io.currentState);

  let events = fs.readdirSync("./event_listeners");
  events = events.filter((file) => file.endsWith(".js"));

  events.forEach((file) => {
    socket.on(file.split(".")[0], (data) => {
      require(path.join(__dirname, "event_listeners", file))({
        data,
        socket,
        io,
      });
    });
  });
});

app.get("/api/check-secret-key", (req, res) => {
  const isadmin = req?.query?.key === process.env.SECRET_KEY;
  res.json(isadmin);
  if (isadmin) {
    io.admin = req?.query?.socket;
    emitControllerRevoked(io);
  }
});

app.get("/api/videos", (req, res) => {
  if (req?.query?.key === process.env.SECRET_KEY) {
    res.json({ video_state: io.currentState });
  } else {
    res.status(401).json(false);
  }
});

http.listen(3000, function () {
  console.log("listening on http://localhost:3000");
});