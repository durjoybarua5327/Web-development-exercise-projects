console.log("Let's start the js");

let currentsong = new Audio();
let songs;
let folder;
let CurrentFolder;

async function get_songs(folder) {
  CurrentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/spotify-clone-2023/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul = document
  .querySelector(".songlist")
  .getElementsByTagName("ul")[0];
  songul.innerHTML=""
for (const song of songs) {
  songul.innerHTML =
    songul.innerHTML +
    `<li>
              <img src="images/music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
              </div>
              <div class="playnow ">
                <span>Play Now</span>
                <img class="invert" src="images/play.svg" alt="">
              </div>
            </li>`;
}

Array.from(
  document.querySelector(".songlist").getElementsByTagName("li")
).forEach((e) => {
  e.addEventListener("click", () => {
    // console.log(e.querySelector(".info").firstElementChild.innerHTML);
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
});
  
}
const playmusic = (musics, pause = false) => {
  // let audio = new Audio("music/"+musics)
  currentsong.src = `${CurrentFolder}/` + musics;

  let playBtn = document.querySelector(".play-btn img");
  document.querySelector(".songName").innerHTML = musics
    .replaceAll("%20", " ")
    .split(".m4a")[0];

  if (!pause) {
    currentsong.play();
    playBtn.src = "images/paused-icon.svg";
  }
};

function formatTime(seconds) {
  seconds = Math.floor(seconds); // Ensure seconds is an integer
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;

  // Ensure two-digit format
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function DisplayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/spotify-clone-2023/music/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let albums=[]
  let anchors= div.getElementsByTagName("a")
  Array.from(anchors).forEach(e=>{
    if(e.href.includes("/music/")){
      console.log(e.href.split("/").slice(-1))
      
    }
  })
}
async function main() {
  await get_songs("music/Hindi");
  playmusic(songs[0], true);

  DisplayAlbum()
  document.querySelector(".play-btn img").addEventListener("click", () => {
    let playBtn = document.querySelector(".play-btn img");

    if (currentsong.src) {
      if (currentsong.paused) {
        currentsong.play();
        playBtn.src = "images/paused-icon.svg";
      } else {
        currentsong.pause();
        playBtn.src = "images/song-play-icon.svg";
      }
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    if (!isNaN(currentsong.duration)) {
      document.querySelector(".timeshow").innerHTML = `${formatTime(
        currentsong.currentTime
      )} / ${formatTime(currentsong.duration)}`;
    }
    document.querySelector(".circle-in-seekbar").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle-in-seekbar").style.left = percentage + "%";
    currentsong.currentTime = (currentsong.duration * percentage) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
  });
  document.querySelector(".close-icon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  document.querySelector(".leftarrow").addEventListener("click", () => {
    let currentSongName = currentsong.src.split("/").pop();
    console.log(currentSongName)
    let index = songs.indexOf(currentSongName);
    
    if (index > 0) {
      playmusic(songs[index - 1]);
    } else {
      playmusic(songs[songs.length - 1]);
    }
  });
  document.querySelector(".rightarrow").addEventListener("click", () => {
    let currentSongName = currentsong.src.split("/").pop();
    let index = songs.indexOf(currentSongName);

    if (index < songs.length - 1) {
      playmusic(songs[index + 1]);
    } else {
      playmusic(songs[0]);
    }
  });

  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (items) => {
      songs = await get_songs(`music/${items.currentTarget.dataset.folder}`);
      console.log(songs)
    });
  });
}

main();
