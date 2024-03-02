// console.log("Working");
let playButton = document.getElementById("play");
let pauseButton = document.getElementById("pause");
let playAndPauseButton = document.getElementById("playAndPause");
let previousButton = document.getElementById("previous");
let nextButton = document.getElementById("next");
let gif = document.getElementsByClassName("leftSide")[0];
let currentSong = new Audio();
let currFolder;
let songs;
let vol;

function convertSecondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  currFolder = folder;
  //step1:
  let fetchData = await fetch(`./albums/${folder}`);
  let response = await fetchData.text();
  //step:2 get data from div response with the help of tagName
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //step:3 
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
      // console.log(element.href.split(folder)[0]);
    }
  }
  let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
      <div class="coverPic"><img  src="./covers/9.jpg" alt="music"></div>
      <div class="info">
        <div>${song}</div>
        <img src="audio-8777_128.gif" alt="gif">
      </div>
      <div class="playNow">
        <span>Play Now time</span>
         <img class="invert" src="./svg/play.svg" alt="play">
      </div>
      </li>`;
  }
  //Attach an event listener to each song
  Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
  })
}

//play music
const playMusic = (track, pause = false) => {
  currentSong.src = `./albums/${currFolder}` + track;
  if (!pause) {
    currentSong.play();
    pauseButton.style.display = "inline";
    playButton.style.display = "none";
    gif.style.opacity = "1";
    document.querySelector(".leftSide").lastElementChild.innerHTML = track;
  }
  // let songInfo = document.querySelector(".songInfo");
  let songTime = document.querySelector(".songTime");
  // console.log(songInfo);
  //  songInfo.innerHTML = decodeURI(track);
   songTime.style.color = "black";
   songTime.innerHTML = "00:00/00:00";
}
async function main() {
  await getSongs("street_dreams/");
  playMusic(songs[0], true);

  //Add an event listener to seekbar
  document.querySelector(".barCon").addEventListener("click",(e)=>{
    // console.log();
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    // console.log(percent)
    document.querySelector(".moveCircle").style.left = percent+"%";
    currentSong.currentTime = (currentSong.duration*percent)/100;
  });

  playAndPauseButton.addEventListener("click", (e) => {
    if (currentSong.paused || currentSong.currentTime <= 0) {
      currentSong.play();
      pauseButton.style.display = "inline";
      playButton.style.display = "none";
      gif.style.opacity = "1";
    } else {
      console.log("Some :", currentSong);
      currentSong.pause();
      pauseButton.style.display = "none";
      playButton.style.display = "inline";
      gif.style.opacity = "0";
    }
  });
  
  previousButton.addEventListener("click",(e)=>{
    // console.log("previous button");
    // console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0]));
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs , index);
    if((index-1)>= 0){
        playMusic(songs[index-1]);
    }
  });

  next.addEventListener("click",(event)=>{
    currentSong.pause();
    // console.log("next button");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs , index);
    if((index+1) < songs.length){
        playMusic(songs[index+1]);
    }
  });

  //Listen for timeUpdate event
  currentSong.addEventListener("timeupdate",(e)=>{
    // console.log(currentSong.currentTime,":",currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector('.moveCircle').style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
  })

  //Add an event to volume 
  vol=document.querySelector(".rightSide").getElementsByTagName("input")[0];
  vol.addEventListener("change",(e)=>{
    // console.log(e,e.target,e.target.value);
    currentSong.volume = parseInt(e.target.value)/100;
  })

}
main();
