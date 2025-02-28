const socket = io();

const idHolder = document.getElementById("socketid");
const container = document.getElementById("video-container");
const player = document.getElementById("video-player");
const canvasElement = document.getElementById("bg-canvas");
const ambienceMode = document.getElementById("ambience");
const volume = document.getElementById("volume");
const mute = document.getElementById("mute");
const cc = document.getElementById("cc");
const pip = document.getElementById("pip");
const fullscreen = document.getElementById("fullscreen");
const playerInfo = document.getElementById("playerInfo");
const progressBar = document.getElementById("progressBar");
const duration = document.getElementById("duration");
const currentTime = document.getElementById("currentTime");
const progressBarBg = document.getElementById("progressBarBg");
const videoFileSelectInput = document.getElementById("videoFileSelect");
const subtitleFileSelectInput = document.getElementById("subtitleFileSelect");
const videoFileSelectDiv = document.getElementById("videoFileSelectDiv");
const sticky = document.getElementById("sticky");

let selfmode = false;
const selfmodeElement = document.getElementById("selfmode");

const ctx = canvasElement.getContext("2d");
const progressBarCtx = progressBarBg.getContext("2d");

function emitCurrentState() {
  socket.emit("currentState", {
    key: localStorage.getItem("secret-key"),
    paused: player.paused,
    time: player.currentTime,
    src: player.src,
    playbackRate: player.playbackRate,
    selfmode: selfmodeElement ? selfmodeElement.checked : selfmode
  });
}

const modes = ["Sync", "RGB", "Off"];
let currentMode = "Sync";

function isLightMode() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
}

function formatTime(duration) {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);
  return `${hrs > 0 ? hrs + `:` : ""}${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function isFS() {
  return document.fullscreenElement === container;
}

function isPiP() {
  return document.pictureInPictureElement === player;
}

function isDarkTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function cloneCanvasDirect(originalCanvas) {
  const newCanvas = document.createElement("canvas");
  const newCtx = newCanvas.getContext("2d");
  newCanvas.width = originalCanvas.width;
  newCanvas.height = originalCanvas.height;
  newCtx.drawImage(originalCanvas, 0, 0, newCanvas.width, newCanvas.height);
  return newCanvas;
}

function resize() {
    if(document.fullscreenElement === container) return;
    player.style.maxWidth = container.clientWidth * 0.7 + "px";
    player.style.maxHeight = container.clientHeight * 0.84 + "px";
}
resize();
window.addEventListener("resize", resize);