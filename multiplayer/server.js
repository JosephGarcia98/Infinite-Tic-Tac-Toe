const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("../")); 
io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  socket.on("move", (data) => {
    socket.broadcast.emit("move", data);
  });
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Multiplayer server running on http://localhost:${PORT}`)
);