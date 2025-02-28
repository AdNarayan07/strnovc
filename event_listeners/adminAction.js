module.exports = ({ data, socket, io }) => {
  let run = () => {
    switch (data.action) {
      case "source":
        socket.broadcast.emit("source", data.src);
        break;
      case "play":
        socket.broadcast.emit("play", data.time);
        break;
      case "pause":
        socket.broadcast.emit("pause", data.time);
        break;
      case "seek":
        socket.broadcast.emit("seek", data.time);
        break;
    }
  };
  if (io.admin && io.sockets.sockets.has(io.admin)) {
    if (data.key === process.env.SECRET_KEY) run();
  } else if (socket.id === io.controller) run();
};
