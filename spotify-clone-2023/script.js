console.log("Let's start the js");


let currentsong = new Audio();

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
const playmusic= (musics)=>{
  // let audio = new Audio("music/"+musics)
  currentsong.src= "music/"+ musics
  currentsong.play()
}

async function main() {
  let songs = await get_songs();
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
                <img src="images/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20"," ")}</div>
                </div>
                <div class="playnow ">
                  <span>Play Now</span>
                  <img class="invert" src="images/play.svg" alt="">
                </div>
              </li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",()=>{
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })


}



main();
