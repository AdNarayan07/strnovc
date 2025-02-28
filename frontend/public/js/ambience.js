function blendFrames(currentImage, previousImage, progress) {
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  ctx.globalAlpha = 1 - progress;
  ctx.drawImage(previousImage, 0, 0, canvasElement.width, canvasElement.height);

  ctx.globalAlpha = progress;
  ctx.drawImage(currentImage, 0, 0, canvasElement.width, canvasElement.height);

  ctx.globalAlpha = 1;
}

let animationFrame = requestAnimationFrame(syncMode);
let previousFrame = cloneCanvasDirect(canvasElement);
function syncMode() {
  if (currentMode !== "Sync") return;
  canvasElement.width = player.clientWidth;
  canvasElement.height = player.clientHeight;
  canvasElement.style.opacity = isLightMode() ? 0.8 : 0.3;
  ctx.filter = "blur(20px)";

  const offScreenCanvas = document.createElement("canvas");
  offScreenCanvas.width = player.clientWidth;
  offScreenCanvas.height = player.clientWidth;
  const offScreenCtx = offScreenCanvas.getContext("2d");

  offScreenCtx.drawImage(player, 0, 0, offScreenCanvas.width, offScreenCanvas.height);

  ctx.drawImage(previousFrame, 0, 0, canvasElement.width, canvasElement.height);
  const currentFrame = cloneCanvasDirect(offScreenCanvas);
  let transitionProgress = 0;
  function drawBlendBata() {
    blendFrames(currentFrame, previousFrame, transitionProgress);
    transitionProgress += 0.005;
    if (transitionProgress <= 1) {
      requestAnimationFrame(drawBlendBata);
    } else {
      previousFrame = currentFrame;
      animationFrame = requestAnimationFrame(syncMode);
    }
  }
  requestAnimationFrame(drawBlendBata);
}

let hue = 0;
function rgbMode() {
  if (currentMode !== "RGB") return;
  hue = (hue + 0.5) % 360;
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  canvasElement.style.opacity = isLightMode() ? 0.4 : 0.1;
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
  animationFrame = requestAnimationFrame(rgbMode);
}

ambienceMode.addEventListener("click", () => {
  const modes = ["Sync", "RGB", "Off"];
  currentMode = ambienceMode.value;
  const nextMode = modes[(modes.indexOf(currentMode) + 1) % 3];
  ambienceMode.value = currentMode = nextMode;
  console.log(currentMode);

  cancelAnimationFrame(animationFrame);
  canvasElement.style.display = "block";
  switch (currentMode) {
    case "Sync":
      animationFrame = requestAnimationFrame(syncMode);
      break;
    case "RGB":
      animationFrame = requestAnimationFrame(rgbMode);
      break;
    default:
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasElement.style.display = "none";
      break;
  }
});
