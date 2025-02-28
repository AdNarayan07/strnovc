let controller = false;

socket.on("connect", () => {
    idHolder.innerText = socket.id;
});

socket.on("currentState", (data) => {
    if(!data) return console.log("Null State")
    console.log(data.selfmode)
    selfmode = data.selfmode
    if (selfmode) videoFileSelectDiv.style.display = "block"
    else videoFileSelectDiv.style.display = "none"
    if (player.src !== data.src && !selfmode) player.setAttribute("src", data.src);
    if (player.readyState < 3) return;
    player.playbackRate = data.playbackRate;

    if (data.paused) {
        if (!player.paused) player.pause();
    } else player.play();
    if (Math.abs(player.currentTime - data.time) > 2)
        player.currentTime = data.time;
});

socket.on("controllerAssigned", (_d, callback) => {
    controller = true;
    idHolder.style.backgroundColor = isLightMode() ? "#00ff00" : "green";
    player.setAttribute("controls", "controls")
    player.style.pointerEvents = "all"
    callback(socket?.id);
});

socket.on("controllerRevoked", (_d, callback) => {
    controller = false;
    idHolder.style.backgroundColor = "";
    player.removeAttribute("controls")
    player.style.pointerEvents = ""
    callback("acknowledge");
});