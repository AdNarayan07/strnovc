function emitControllerAssigned(io, maxRetries=5, retryCount=0) {
    const defaultNamespace = io.of("/");
    const connectedSockets = Array.from(defaultNamespace.sockets.values());

    if (connectedSockets.length > 0) {
      const randomIndex = Math.floor(Math.random() * connectedSockets.length);
      const randomSocket = connectedSockets[randomIndex];

      emitControllerRevoked(io);
      randomSocket.emit('controllerAssigned', { message: 'You are now the controller!' }, (id) => {
        console.log(id)
        if (id) {
          io.controller = id;
          console.log('Controller assignment confirmed by socket ID:', randomSocket.id);
        } else {
          console.log('Failed to confirm controller assignment for socket ID:', randomSocket.id);
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            emitControllerAssigned(io, maxRetries, retryCount);
          } else {
            console.log('Max retries reached. Controller assignment failed.');
          }
        }
      });

      console.log("Controller assigned to socket ID:", randomSocket.id);
    } else {
      console.log("No clients connected in the default namespace.");
    }
  }

  function emitControllerRevoked(io){
    io.emit("controllerRevoked", null, (acknowledge) => {
      if(acknowledge) io.controller = null;
    });
  }

module.exports = { emitControllerAssigned, emitControllerRevoked }