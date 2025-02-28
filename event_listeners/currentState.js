module.exports = ({ data, socket, io }) => {
  const { key, ...dataWithoutKey } = data;
  io.currentState = dataWithoutKey;
  if (io.admin && io.sockets.sockets.has(io.admin)) {
    if (data.key === process.env.SECRET_KEY)
    socket.broadcast.emit("currentState", dataWithoutKey);
  } else if (socket.id === io.controller)
    socket.broadcast.emit("currentState", dataWithoutKey);
};
