player.addEventListener("play", () => {
  if (location.pathname !== "/admin" && !controller) return;
  emitCurrentState()
});

player.addEventListener("pause", () => {
  if (location.pathname !== "/admin" && !controller) return;
  emitCurrentState()
});

player.addEventListener("seeked", () => {
  if (location.pathname !== "/admin" && !controller) return;
  emitCurrentState()
});

videoFileSelectInput.addEventListener("change", function (event) {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    player.src = URL.createObjectURL(file); // Create a blob URL for the file
    player.load(); // Load the video into the player
  }
});

subtitleFileSelectInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
    if (file && file.type === "text/vtt") {
      const fileURL = URL.createObjectURL(file);

      // Remove all existing tracks
      const existingTracks = player.querySelectorAll("track");
      existingTracks.forEach(track => track.remove());

      // Create a new track element
      const track = document.createElement("track");
      track.src = fileURL;
      track.kind = "subtitles";
      track.label = file.name;
      track.default = true; // Set the new track as default

      // Append the new track to the video player
      player.appendChild(track);

      // Optionally reload the video for the new subtitle to take effect immediately
      player.load();

      console.log(`Subtitle track "${file.name}" added.`);
      cc.style.display = "block"
    } else {
      console.error("Please select a valid .vtt file.");
    }
})

cc.addEventListener("click", function () {
  const tracks = player.textTracks; // Get all available text tracks
  const ccButton = document.getElementById("ccText");

  if (tracks.length) {
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = tracks[i].mode === "hidden" ? "showing" : "hidden";
    }
    ccButton.innerText = tracks[0].mode === "showing" ? "Hide CC" : "Show CC";
  } else {
    alert("No subtitles available.");
  }
});


setInterval(() => {
  if (location.pathname !== "/admin" && !controller) return;
  if (!player.readyState) return;
  emitCurrentState()
}, 1000);
