const fileInput = document.getElementById("fileInput");
const albumInput = document.getElementById("albumInput");
const searchBar = document.getElementById("searchBar");
const songList = document.getElementById("songList");
const playerContainer = document.getElementById("playerContainer");
const audioPlayer = document.getElementById("audioPlayer");
const albumArt = document.getElementById("albumArt");
const playPauseBtn = document.getElementById("playPauseBtn");
const removeSongBtn = document.getElementById("removeSongBtn");

let songs = JSON.parse(localStorage.getItem("songs")) || [];
let currentSongIndex = 0;

// Set up album input (hidden)
albumInput.type = "file";
albumInput.accept = "image/*";
albumInput.style.display = "none";
document.body.appendChild(albumInput);

// Load stored songs
function loadSongs() {
    songList.innerHTML = "";
    songs.forEach((song, index) => {
        let songItem = document.createElement("div");
        songItem.classList.add("songItem");
        songItem.textContent = song.name;
        songItem.addEventListener("click", () => playSong(index));
        songList.appendChild(songItem);
    });
}

// Function to load songs on startup
function loadSongs() {
    songList.innerHTML = "";
    songs.forEach((song, index) => {
        let songItem = document.createElement("div");
        songItem.classList.add("songItem");
        songItem.textContent = song.name;
        songItem.addEventListener("click", () => playSong(index));
        songList.appendChild(songItem);
    });
}


// Handle audio file upload
fileInput.addEventListener("change", async (event) => {
    const files = event.target.files;
    for (let file of files) {
        const base64Audio = await convertToBase64(file);
        songs.push({ name: file.name, url: base64Audio, album: "default-album.jpg" });
    }
    localStorage.setItem("songs", JSON.stringify(songs));
    loadSongs();
});

// Convert audio file to Base64 for storage
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Click album art to upload an image
albumArt.addEventListener("click", () => {
    if (songs.length > 0) {
        albumInput.click(); // Open file input
    }
});

// Handle album art upload
albumInput.addEventListener("change", (event) => {
    if (songs.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            songs[currentSongIndex].album = e.target.result;
            updateLocalStorage();
            albumArt.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


// Ensure local storage is updated with the latest songs data
function updateLocalStorage() {
    localStorage.setItem("songs", JSON.stringify(songs));
}

// Search songs
searchBar.addEventListener("input", () => {
    let query = searchBar.value.toLowerCase();
    let filteredSongs = songs.filter(song => song.name.toLowerCase().includes(query));

    songList.innerHTML = "";
    filteredSongs.forEach((song, index) => {
        let songItem = document.createElement("div");
        songItem.classList.add("songItem");
        songItem.textContent = song.name;
        songItem.addEventListener("click", () => playSong(index));
        songList.appendChild(songItem);
    });
});

// Play selected song
function playSong(index) {
    currentSongIndex = index;
    audioPlayer.src = songs[index].url;
    playerContainer.classList.remove("hidden");
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
}

// Remove currently playing song
removeSongBtn.addEventListener("click", () => {
    if (songs.length > 0) {
        songs.splice(currentSongIndex, 1); // Remove from array
        localStorage.setItem("songs", JSON.stringify(songs)); // Update storage
        loadSongs(); // Reload song list

        if (songs.length > 0) {
            currentSongIndex = Math.min(currentSongIndex, songs.length - 1); // Adjust index
            playSong(currentSongIndex); // Play next song
        } else {
            playerContainer.classList.add("hidden"); // Hide player if empty
            audioPlayer.src = "";
        }
    }
});


// Play/Pause functionality
playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸";
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶";
    }
});

// Load songs on page load
window.onload = loadSongs;
