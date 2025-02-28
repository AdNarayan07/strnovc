const { emitControllerAssigned } = require("../functions");
module.exports = ({ socket, io }) => {
  if (io.controller === socket.id) {
    io.controller = null;
    console.log("controller bhaga")
    emitControllerAssigned(io)
  }
  if (io.admin === socket.id) {
    io.admin = null;
    console.log("admin bhaga")
    emitControllerAssigned(io)
  }
  const connectedSockets = Array.from(io.sockets.sockets.values());
  if (!connectedSockets.length) io.currentState = null;
};