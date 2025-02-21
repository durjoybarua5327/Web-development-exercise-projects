console.log("Let's start the js");

async function get_songs() {
  let a = await fetch("http://127.0.0.1:5500/spotify-clone-2023/music/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split("/music/")[1]);
    }
  }
  return songs;
}

async function main() {
  let songs = await get_songs();
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>${song.replaceAll("%20"," ")}</li>`;
  }
  let audio = new Audio(songs[1]);
  //   audio.play();
  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}
main();
