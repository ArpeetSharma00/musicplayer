// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login with Google
document.getElementById("google-login").addEventListener("click", function() {
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        alert("Welcome " + result.user.displayName);
    }).catch(error => console.log(error.message));
});

// Search Functionality
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", function() {
    let query = searchBar.value.toLowerCase();
    let songs = document.querySelectorAll("#playlist-items li");
    songs.forEach(song => {
        song.style.display = song.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
});

// Sample Playlist
const playlist = [
    { title: "Birds Chirping", src: "birds.mp3", album: "birds.jpg" },
    { title: "Rainforest Sounds", src: "rainforest.mp3", album: "rainforest.jpg" },
    { title: "Ocean Waves", src: "ocean.mp3", album: "ocean.jpg" }
];

const playlistContainer = document.getElementById("playlist-items");
const playerContainer = document.getElementById("player-container");
const audioPlayer = document.getElementById("audio-player");
const nowPlaying = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");
const playPauseBtn = document.getElementById("play-pause-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

let currentSongIndex = 0;
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
let isShuffle = false;
let isRepeat = false;

// Shuffle Button
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? "lightgreen" : "white";
});

// Repeat Button
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? "lightgreen" : "white";
});

// Next Song Function
document.getElementById("next-btn").addEventListener("click", () => {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentSongIndex);
        playSong(randomIndex);
    } else {
        let nextIndex = (currentSongIndex + 1) % playlist.length;
        playSong(nextIndex);
    }
});

// Repeat Song
audioPlayer.addEventListener("ended", () => {
    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        document.getElementById("next-btn").click();
    }
});


// Function to Play Song
function playSong(index) {
    let song = playlist[index];
    nowPlaying.textContent = song.title;
    audioPlayer.src = song.src;
    albumArt.src = song.album;
    audioPlayer.play();
    playerContainer.classList.remove("hidden");
    playPauseBtn.textContent = "⏸️"; // Change button to pause
    currentSongIndex = index;
}

// Add Songs to Playlist
playlist.forEach((song, index) => {
    let li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => playSong(index));
    playlistContainer.appendChild(li);
});

// Play/Pause Button
playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶️";
    }
});

// Update Progress Bar
audioPlayer.addEventListener("timeupdate", () => {
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Seek Feature
progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Format Time
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
