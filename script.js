// console.log("Working");
let playButton = document.getElementById("play");
let pauseButton = document.getElementById("pause");
let playAndPauseButton = document.getElementById("playAndPause");
let previousButton = document.getElementById("previous");
let nextButton = document.getElementById("next");
let gif = document.getElementsByClassName("leftSide")[0];
let cardContainerJ = document.querySelector(".cardInsideDiv");
let masterPlayer = document.querySelector(".playSong");
let showList = document.querySelector(".spotifyHead").lastElementChild;
let leftDiv = document.querySelector(".left");
let timeList = document.getElementsByClassName("timeNow");
let invertClass = document.getElementsByClassName("invert");
// let albumName = document.querySelectorAll(".cardSongName");

let currentSong = new Audio();
let currFolder = [];
let songs;
let vol;
let flag = true;
// let indexValueOfSong;

//convert Seconds To minutes and seconds
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

//Songs list
async function getSongs(folder) {
  currFolder = folder;
  //step1:
  let fetchData = await fetch(`./albums/${folder}`);
  let response = await fetchData.text();
  // console.log(response);
  //step:2 get data from div response with the help of tagName
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)
  //step:3 
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
      // console.log(element.href.split(folder)[0]);
    }
  }
  // console.log(songs);
  let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
      <div class="coverPic"><img  src="./covers/5.jpg" alt="music"></div>
      <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <p>${song.replaceAll("%20", " ")}</p>
      </div>
      <div class="playNow">
        
        <span class="timeNow">00:00/00:00</span>
        <img class="invert" src="./svg/play-button-svgrepo-com.svg" alt="play"/>
      </div>
      </li>`;
  }
  //<img class="gif" src="audio-8777_128.gif" alt="gif"/>
  //Attach an event listener to each song
  Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach((element, index, array) => {
    // console.log(element); li return
    element.addEventListener("click", (event) => {
      playMusic(element.querySelector(".info").firstElementChild.innerHTML.replaceAll("%20", " ")); //song name
      masterPlayer.style.opacity = "1";

      Array.from(document.getElementsByClassName("invert")).forEach((ele, ind, ar) => {
        // console.log(ele);
        if (index == ind) {
          ele.src = "./svg/pause.svg";
        }
        else {
          ele.src = "./svg/play-button-svgrepo-com.svg";
        }
      });

      Array.from(timeList).forEach((elementList, indexList) => {
        // console.log(elementList,indexList);
        if (index == indexList) {
          currentSong.addEventListener("timeupdate", (event) => {
            elementList.innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
          })
        } else {
          // elementList.innerHTML = "00:00/00:00";
          currentSong.addEventListener("timeupdate", (event) => {
            elementList.innerHTML = "00:00/00:00";
          })
          // console.log(elementList.innerHTML);
        }
      });
    });
  });
}
//play music
const playMusic = (track, pause = false) => {
  //currFolder : Album name ex: still rollin
  currentSong.src = `./albums/${currFolder}` + track;
  if (!pause) {
    currentSong.play();
    pauseButton.style.display = "inline";
    playButton.style.display = "none";
    gif.style.opacity = "1";
    document.querySelector(".leftSide").lastElementChild.innerHTML = track;
  }
  let songTime = document.querySelector(".songTime");
  //  songInfo.innerHTML = decodeURI(track);
  songTime.style.color = "black";
  songTime.innerHTML = "00:00/00:00";
}
// Albums logic
const someMethod = async () => {
  let songD = await fetch(`./albums`);
  let res = await songD.text();
  // console.log(res); 

  let d = document.createElement("div");
  d.innerHTML = res;
  let as = d.getElementsByTagName("a");

  //step:3 
  titlesArr = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.title != "" && element.title != "..") {
      titlesArr.push(element.title);
    }
  }
  // console.log(titlesArr);
  // cardContainerJ.innerHTML ="";
  for (let index = 0; index < titlesArr.length; index++) {
    const element = titlesArr[index];
    // console.log(index);
    cardContainerJ.innerHTML += `
      <div class="card">
                        <img src="./covers/${index + 1}.jpg" alt="cover photo">
                        <h3 class="cardSongName">${element}</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>`;
  }
  // let songClicked = titlesArr[0];
  Array.from(document.querySelectorAll(".card")).forEach((element, index, array) => {
    // console.log(cardContainerJ);
    element.addEventListener("click", (e) => {
      getSongs(`${titlesArr[index]}/`);
      showList.style.opacity = "1";
      document.querySelector(".songsList").style.display = "block";
    })
  })
  // await getSongs("street_dreams/");
}
//code starts from here...
async function main() {
  await someMethod();
  // await getSongs("street_dreams/");
  // playMusic(songs[0], true);
  // playMusic(songs[0], true);

  //Add an event listener to seekbar
  document.querySelector(".barCon").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".moveCircle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  playAndPauseButton.addEventListener("click", (e) => {
    if (currentSong.paused || currentSong.currentTime <= 0) {
      currentSong.play();
      pauseButton.style.display = "inline";
      playButton.style.display = "none";
      gif.style.opacity = "1";
      // for(let a in invertClass){
      //   // console.log(currentSong);
      //   // if(a == indexValueOfSong){
      //   //   // invertClass[a].src = "./svg/pause.svg";
      //   // }
      // }
      Array.from(document.getElementsByClassName("info")).forEach((element, index) => {
        // console.log(element.firstElementChild.innerHTML , index);
        // console.log(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "), index);
        if (element.firstElementChild.innerHTML == currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " ")) {
          invertClass[index].src = "./svg/pause.svg";
        }
      })
    } else {
      for (let a in invertClass) {
        invertClass[a].src = "./svg/play-button-svgrepo-com.svg";
      }
      currentSong.pause();
      pauseButton.style.display = "none";
      playButton.style.display = "inline";
      gif.style.opacity = "0";
    }
  });

  previousButton.addEventListener("click", (e) => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1].replaceAll("%20", " "));
      Array.from(document.getElementsByClassName("info")).forEach((element, index) => {
        // console.log(element.firstElementChild.innerHTML , index);
        // console.log(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "), index);
        if (element.firstElementChild.innerHTML == currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " ")) {
          invertClass[index].src = "./svg/pause.svg";
          currentSong.addEventListener("timeupdate", (event) => {
            timeList[index].innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
          });
        } else {
          invertClass[index].src = "./svg/play-button-svgrepo-com.svg";
          currentSong.addEventListener("timeupdate", (event) => {
            timeList[index].innerHTML = "00:00/00:00";
          });
        }
      });
    }
  });

  next.addEventListener("click", (event) => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs.length);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1].replaceAll("%20", " "));
      Array.from(document.getElementsByClassName("info")).forEach((element, index) => {
        if (element.firstElementChild.innerHTML == currentSong.src.split("/").slice(-1)[0].replaceAll("%20", " ")) {
          invertClass[index].src = "./svg/pause.svg";
          currentSong.addEventListener("timeupdate", (event) => {
            timeList[index].innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
          });
        } else {
          invertClass[index].src = "./svg/play-button-svgrepo-com.svg";
          currentSong.addEventListener("timeupdate", (event) => {
            timeList[index].innerHTML = "00:00/00:00";
          });
        }
      })
    }
    // else{
    //   playMusic(songs[songs.length].replaceAll("%20", " "));
    // }
  });

  //Listen for timeUpdate event
  currentSong.addEventListener("timeupdate", (e) => {
    // console.log(currentSong.currentTime,":",currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector('.moveCircle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  showList.addEventListener("click", (e) => {
    if (flag) {
      // console.log(flag)
      document.querySelector(".songsList").style.display = "none";
      flag = false;
    } else {
      // console.log(flag)
      document.querySelector(".songsList").style.display = "block";
      flag = true;
    }
  });

  //Add an event to volume 
  vol = document.querySelector(".rightSide").getElementsByTagName("input")[0];
  vol.addEventListener("change", (e) => {
    // console.log(e,e.target,e.target.value);
    // console.log(e.target.value/100);
    currentSong.volume = parseInt(e.target.value) / 100;
  });
  document.addEventListener("keydown", (e) => {
    // e.preventDefault()
    // console.log(e)
    currentSong.volume = parseInt(vol.value) / 100;
    if (e.code === "AudioVolumeUp") {
      // console.log((parseFloat(currentSong.volume)*100)+2);
      vol.value = (parseFloat(currentSong.volume) * 100) + 2;
      if (vol.value >= 100) {
        vol.value = 100;
      }
    } else if (e.code === "AudioVolumeDown") {
      // console.log(e.target.value);
      vol.value = (parseFloat(currentSong.volume) * 100) - 2;
      if (vol.value <= 0) {
        vol.value = 0;
      }
    } else if (e.code === "KeyM") {
      // console.log("M clicked");
      currentSong.muted = true;
      document.querySelector(".audio-off").style.display = "inline";
      document.querySelector(".audio-on").style.display = "none";
    } else if (e.code === "KeyU") {
      // console.log("U clicked");
      currentSong.muted = false;
      document.querySelector(".audio-on").style.display = "inline";
      document.querySelector(".audio-off").style.display = "none";
    } else if (e.code === "ArrowRight") {
      // console.log("Arrow Right Clicked");
    } else if (e.code === "ArrowLeft") {
      // console.log("Arrow Left Clicked");
    }
  });
  document.querySelector(".audio-on").addEventListener("click", (e) => {
    currentSong.muted = true;
    document.querySelector(".audio-off").style.display = "inline";
    e.target.style.display = "none";
  });

  document.querySelector(".audio-off").addEventListener("click", (e) => {
    currentSong.muted = false;
    document.querySelector(".audio-on").style.display = "inline";
    e.target.style.display = "none";
  });
}
main();
// Hamburger on nav bar in rightside of div
document.querySelector(".hambur").addEventListener("click", (e) => {
  leftDiv.style.position = "absolute";
  leftDiv.style.display = "flex";
  leftDiv.style.zIndex = "2";
});
//Absolute left div
document.querySelector(".cross").addEventListener("click", (e) => {
  leftDiv.style.display = "none";
  leftDiv.style.position = "relative";
})
//play and pause button
document.addEventListener("keydown", (e) => {
  e.defaultPrevented;
  if (e.code === 'Space') {
    if (currentSong.paused) {
      currentSong.play();
      pauseButton.style.display = "inline";
      playButton.style.display = "none";
      gif.style.opacity = "1";
    } else {
      currentSong.pause();
      pauseButton.style.display = "none";
      playButton.style.display = "inline";
      gif.style.opacity = "0";
    }
  }
})