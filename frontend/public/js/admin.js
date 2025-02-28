const secretKeyForm = document.getElementById("secret-key-form");
const mainDiv = document.getElementById("main");
const adminFields = document.getElementById("adminFields");
const adminFieldButton = document.getElementById("adminFieldButton");

const videoSourceForm = document.getElementById("vidsrcform");

socket.on("verifyAdminConnection", (data) => {
  if (data) {
    loadAdmin();
    document.getElementById("socketid").innerText = socket.id;
  } else {
    alert("Admin Already Connected");
    location.href = "/";
  }
});

async function loadAdmin() {
  const key = localStorage.getItem("secret-key") || "";

  let res = await fetch("/api/check-secret-key?key=" + key + "&socket=" + socket.id);
  let is_correct = await res.json();
  if (is_correct) {
    mainDiv.style.display = "flex";
    secretKeyForm.style.display = "none"

    let res = await fetch("/api/videos?key=" + key);
    let { video_state } = await res.json();

    if (video_state) {
      console.log(video_state);
      player.src = video_state.src;
      player.currentTime = video_state.time;
      selfmode = video_state.selfmode;
      selfmodeElement.checked = selfmode;
      if (selfmode) videoFileSelectDiv.style.display = "block"
    else videoFileSelectDiv.style.display = "none"
    }

    player.setAttribute("controls", "controls");
  } else {
    alert("Wrong Key!");
  }
}

function setvideo(path) {
  if (selfmodeElement?.checked) return alert("Self Mode!");
  player.setAttribute("src", path);
  emitCurrentState()
}

secretKeyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputElement = document.getElementById("secret-key");
  localStorage.setItem("secret-key", inputElement.value);
  location.reload();
});

videoSourceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let src = document.getElementById("vidsrc").value;
  setvideo(src);
});

selfmodeElement.onchange = () => {
  if (selfmodeElement.checked) videoFileSelectDiv.style.display = "block"
  else videoFileSelectDiv.style.display = "none"
  emitCurrentState()
}

adminFields.onmouseenter = adminFieldButton.onclick = () => adminFields.style.translate = "0 0";
mainDiv.onmouseenter = () => adminFields.style.translate = "-99.9% 0"
idHolder.style.backgroundColor = isLightMode() ? "#00ff00" : "green";