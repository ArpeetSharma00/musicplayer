const songs = [
    { title: "Hero - Charlie Puth", src: "C:\Users\SSD\Music\music\Hero - Charlie Puth.mp3", image: "bird.jpg" },
    { title: "Rainforest", src: "rainforest.mp3", image: "rain.jpg" },
    { title: "Ocean Waves", src: "ocean.mp3", image: "ocean.jpg" }
];

let currentSong = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const songTitle = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");

function loadSong(index) {
    songTitle.textContent = songs[index].title;
    audio.src = songs[index].src;
    albumArt.src = songs[index].image;
}
function playPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = "&#9654;";
    } else {
        audio.play();
        playPauseBtn.innerHTML = "&#10074;&#10074;";
    }
    isPlaying = !isPlaying;
}
function nextSong() {
    if (isShuffle) {
        currentSong = Math.floor(Math.random() * songs.length);
    } else {
        currentSong = (currentSong + 1) % songs.length;
    }
    loadSong(currentSong);
    audio.play();
}
function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play();
}
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.background = isShuffle ? "lightgreen" : "white";
}
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.background = isRepeat ? "lightgreen" : "white";
}
audio.onended = () => {
    if (isRepeat) {
        audio.play();
    } else {
        nextSong();
    }
};

playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);

loadSong(currentSong);
