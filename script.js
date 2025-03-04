console.log('lets write JacaScript')



let currentSong = new Audio(); 
let songs;
let currfolder;

function formatTime(seconds) {
  // Ensure the input is an integer by ignoring milliseconds
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format with leading zero if needed
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage
const time = formatTime(72.8); // 72.8 seconds
console.log(time); // Output: "01:12"



async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${currfolder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")


   songs = []
 
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }

  }
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML=""

  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> 
    <div class="songname">
    
    <img src="assets/music.svg" alt="">
    <div class="info">
    <div class="songg"> ${song.replaceAll("%20", " ")}</div>
    </div>  
    </div>
                      
                  <div class="playnow">
                   
                    <img  src="assets/playyy.svg" alt="">
                  </div> </li>`;

  }



  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
 
    

    e.addEventListener("click",element=>{
      
   
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      

    })
   
    
  })
return songs
  
  
}

const playMusic= (track, pause=false)=>{
  // let audio=new Audio("/songs/"+track)
  currentSong.src= `/${currfolder }/` + track
  if(!pause){

    currentSong.play()
     play.src="assets/pause.svg"
  }

   document.querySelector(".songinfo").innerHTML = decodeURI(track)

   document.querySelector(".songtime").innerHTML="00.00 / 00.00"

}



async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors= div.getElementsByTagName("a")
  let cardcontainer=document.querySelector(".cardcontainer")
  
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-2)[1]
     
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let response = await a.json();
     
      cardcontainer.innerHTML = cardcontainer.innerHTML+ ` <div data-folder="${folder}" class="card  rounded ">
                        <div class="play"><img src="assets/play.svg" alt=""></div>

                        <img class="rounded" src="songs/${folder}/cover.jpg"
                            alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
     
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  })

}

async function main() {
  await getSongs("songs/English")
  playMusic(songs[0] ,true)

  displayAlbums()
 

  

  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src="assets/pause.svg"
    }
    else{
      currentSong.pause()
      play.src="assets/playy.svg"
    }
  })

  currentSong.addEventListener("timeupdate", ()=>{
    // console.log(currentSong.currentTime, currentSong.duration);
document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 +"%";

  })

document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
  

  document.querySelector(".circle").style.left= (e.offsetX/e.target.getBoundingClientRect().width) * 100 + "%";
 
  currentSong.currentTime=((currentSong.duration)*percent)/100
       
})



currentSong.addEventListener('ended',()=>{
  
  currentSong.pause()
  let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index+1)<songs.length  ){
   playMusic(songs[index+1])

  
}
})

document.querySelector(".hamburger").addEventListener("click", ()=>{
   document.querySelector(".left").style.left="0";
})

document.querySelector(".close").addEventListener("click", ()=>{
  document.querySelector(".left").style.left="-100%";
})

document.querySelector(".spotifyPlaylists").addEventListener("click", ()=>{
  document.querySelector(".left").style.left="-100%";
})

previous.addEventListener("click", ()=>{
  currentSong.pause()

   let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
   if((index-1)>=0){
    playMusic(songs[index-1])
   }
})
next.addEventListener("click", ()=>{
  currentSong.pause()
  let index =songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if((index+1)<songs.length  ){
   playMusic(songs[index+1])
  }
})

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
   currentSong.volume= parseInt(e.target.value)/100
})

//load the playslist whenever click
document.querySelector(".volume>img").addEventListener("click", e=>{
   if(e.target.src.includes("assets/volume.svg")){
    e.target.src= e.target.src.replace("assets/volume.svg","assets/mute.svg") 
    currentSong.volume= 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value= 0;

   }
   else{
    e.target.src= e.target.src.replace("assets/mute.svg","assets/volume.svg") 
    currentSong.volume= 0.1;
    document.querySelector(".range").getElementsByTagName("input")[0].value= 40;

   }
})


}




main()





























