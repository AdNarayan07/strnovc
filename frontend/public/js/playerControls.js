volume.value = localStorage.getItem("volume") || 1

function updateVolumeSlider() {
  const value = volume.value;
  localStorage.setItem("volume", value);

  // Check system theme and set the slider color accordingly
  const sliderColor = isDarkTheme() ? `white ${value * 100}%, #222` : `#222 ${value * 100}%, white`;

  volume.style.background = `linear-gradient(to right, ${sliderColor} ${value * 100}%)`;
  player.volume = volume.value;
}
updateVolumeSlider();

volume.addEventListener("input", updateVolumeSlider);
player.addEventListener("volumechange", () => volume.value = player.volume);

mute.addEventListener('click', () => {

  if (player.volume == 0) {
    player.volume = volume.value = localStorage.getItem("volume") || 0.5; // Fallback in case localStorage is empty
    const sliderColor = isDarkTheme() ? `white ${volume.value * 100}%, #222` : `#222 ${volume.value * 100}%, white`;
    volume.style.background = `linear-gradient(to right, ${sliderColor} ${volume.value * 100}%)`;
  } else {
    volume.style.background = isDarkTheme() ? "#222" : "white";
    player.volume = volume.value = 0;
  }
})

// Listen for system theme changes and update the slider color dynamically
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateVolumeSlider);


pip.addEventListener("click", () => {
  if (document.pictureInPictureElement === player) document.exitPictureInPicture()
  else player.requestPictureInPicture()
})

fullscreen.addEventListener("click", () => {
  if (document.fullscreenElement === container) document.exitFullscreen()
  else container.requestFullscreen()
})

let infoOpacityTO;
document.addEventListener("mousemove", () => {
  clearTimeout(infoOpacityTO);
  playerInfo.style.opacity = 1;
  sticky.style.opacity = 1;
  infoOpacityTO = setTimeout(() => {
    playerInfo.style.opacity = 0;
    sticky.style.opacity = 0;
  }, 2000);
})

player.addEventListener("timeupdate", () => {
  progressBar.max = player.duration;
  progressBar.value = player.currentTime;

  duration.innerText = formatTime(player.duration).replaceAll("NaN", "--")
  currentTime.innerText = formatTime(player.currentTime).replaceAll("NaN", "--")
});

function updateControls() {
  progressBarCtx.fillStyle = isDarkTheme() ? 'white' : '#222';

  progressBarCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
  progressBarCtx.filter = "blur(20px)";

  if (currentMode !== "Off") {
    progressBarCtx.drawImage(canvasElement, 0, 0)
  }

  requestPiP.style.display = isPiP() ? "none" : "block"
  exitPiP.style.display = isPiP() ? "block" : "none"

  requestFS.style.display = isFS() ? "none" : "block";
  exitFS.style.display = isFS() ? "block" : "none";
  player.style.maxWidth = isFS() ? "100%" : container.clientWidth * 0.7 + "px";
  player.style.maxHeight = isFS() ? "100%" : container.clientWidth * 0.7 + "px";

  unmuted.style.display = player.volume ? "block" : "none"
  muted.style.display = player.volume ? "none" : "block"

  requestAnimationFrame(updateControls)
}

requestAnimationFrame(updateControls)