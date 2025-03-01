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
  songul.innerHTML = "";
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
  let albums = [];
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/music/")) {
      //console.log(e.href.split("/").slice(-1))
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(
        `http://127.0.0.1:5500/spotify-clone-2023/music/${folder}/info.json`
      );
      let response = await a.json();
     
      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play-button">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="#1ed760" />
                  <path d="M4 7V3L7 5L4 7Z" fill="black" />
                </svg>
              </div>
              <img src="images/cover.jpg" alt="" />
              <h4>${response.title} </h4>
              <h5>${response.description}</h5>
            </div>`;
    }
  }
  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (items) => {
      await get_songs(`music/${items.currentTarget.dataset.folder}`);
      console.log(songs);
    });
  });
}
async function main() {
  await get_songs("music/Hindi");
  playmusic(songs[0], true);

  DisplayAlbum();
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
    let index = songs.indexOf(currentSongName); 
    console.log(currentSongName)
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

  let volumeImage = document.querySelector(".volume img");
  let volumeSlider = document.querySelector(".volume input");

  volumeSlider.addEventListener("input", (e) => {
    let volumeValue = e.target.value / 100;
    currentsong.volume = volumeValue;

    if (volumeValue === 0) {
      volumeImage.src = "images/mute.svg";
    } else {
      volumeImage.src = "images/volume.svg";
    }
  });

  volumeImage.addEventListener("click", () => {
    if (currentsong.volume > 0) {
      currentsong.volume = 0;
      volumeSlider.value = 0;
      volumeImage.src = "images/mute.svg";
    } else {
      currentsong.volume = 0.5; // Default volume
      volumeSlider.value = 20;
      volumeImage.src = "images/volume.svg";
    }
  });
}

main();
