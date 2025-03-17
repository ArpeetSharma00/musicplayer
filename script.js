const fileInput = document.getElementById("fileInput");
const searchBar = document.getElementById("searchBar");
const songList = document.getElementById("songList");
const playerContainer = document.getElementById("playerContainer");
const audioPlayer = document.getElementById("audioPlayer");
const albumArt = document.getElementById("albumArt");
const playPauseBtn = document.getElementById("playPauseBtn");
const removeSongBtn = document.getElementById("removeSongBtn");

// Hidden file input for album art
const albumInput = document.createElement("input");
albumInput.type = "file";
albumInput.accept = "image/*";
albumInput.style.display = "none";
document.body.appendChild(albumInput);

let songs = JSON.parse(localStorage.getItem("songs")) || [];
let currentSongIndex = 0;

// Load saved songs
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

// Upload audio files
fileInput.addEventListener("change", async (event) => {
    const files = event.target.files;
    for (let file of files) {
        const base64Audio = await convertToBase64(file);
        songs.push({ name: file.name, url: base64Audio, album: "default-album.jpg" });
    }
    updateLocalStorage();
    loadSongs();
});

// Convert file to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Click album art to upload
albumArt.addEventListener("click", () => {
    if (songs.length > 0) {
        albumInput.click();
    }
});

// Handle album art upload
albumInput.addEventListener("change", async (event) => {
    if (songs.length > 0) {
        const file = event.target.files[0];
        const base64Image = await convertToBase64(file);

        // Assign to current song
        songs[currentSongIndex].album = base64Image;
        updateLocalStorage();
        albumArt.src = base64Image;
    }
});

// Save to local storage
function updateLocalStorage() {
    localStorage.setItem("songs", JSON.stringify(songs));
}

// Search functionality
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
    albumArt.src = songs[index].album || "default-album.jpg";
    playerContainer.classList.remove("hidden");
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
    albumArt.classList.add("pulsing"); // Apply new pulse animation
}

// Remove song
removeSongBtn.addEventListener("click", () => {
    if (songs.length > 0) {
        songs.splice(currentSongIndex, 1);
        updateLocalStorage();
        loadSongs();

        if (songs.length > 0) {
            currentSongIndex = Math.min(currentSongIndex, songs.length - 1);
            playSong(currentSongIndex);
        } else {
            playerContainer.classList.add("hidden");
            audioPlayer.src = "";
            albumArt.classList.remove("spinning");
        }
    }
});

// Play/Pause button
playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸";
        albumArt.classList.add("pulsing"); // Add pulse effect
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶";
        albumArt.classList.remove("pulsing"); // Remove effect when paused
    }
});

const progressBar = document.getElementById("progressBar");

// Update progress bar as song plays
audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
        let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + "%";
    }
});


// Load songs on page load
window.onload = loadSongs;

const lyricsText = document.getElementById("lyricsText");
const fish = document.getElementById("fish");

// Lyrics database for different songs
const lyricsDatabase = {
    "song1.mp3": [
        { time: 0, text: "Here comes the ocean waves," },
        { time: 5, text: "Flowing like a melody..." },
        { time: 10, text: "Underneath the moonlit sky," },
        { time: 15, text: "The tides are calling me." }
    ],
    "song2.mp3": [
        { time: 0, text: "A gentle breeze whispers low," },
        { time: 6, text: "Moonlight sparkles as we go..." },
        { time: 12, text: "Sailing through the waves so free," },
        { time: 18, text: "A song of love beneath the sea." }
    ]
};

// Function to sync lyrics with song playback
function updateLyrics() {
    const currentTime = audioPlayer.currentTime;
    const songFileName = audioPlayer.src.split('/').pop(); // Extracts filename from URL

    if (!lyricsDatabase[songFileName]) {
        lyricsText.innerHTML = "<p>No lyrics available.</p>";
        return;
    }

    let currentLine = "";
    let lyrics = lyricsDatabase[songFileName];

    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            currentLine = lyrics[i].text;
        } else {
            break;
        }
    }

    // Update lyrics display
    lyricsText.innerHTML = `<p>${currentLine}</p>`;

    // Move the fish letter by letter
    fish.style.transform = `translateX(${currentLine.length * 10}px)`;
}

// Update lyrics when song plays
audioPlayer.addEventListener("timeupdate", updateLyrics);

// Change lyrics when a new song is loaded
audioPlayer.addEventListener("loadeddata", () => {
    lyricsText.innerHTML = "<p>Loading lyrics...</p>";
});

