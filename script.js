// Function to open fullscreen music player
function openPlayer(title, albumArt, songFile) {
    document.getElementById("songTitle").textContent = title;
    document.getElementById("albumArt").src = albumArt;
    document.getElementById("audioSource").src = songFile;
    document.getElementById("audioPlayer").load();
    
    // Sync minimized player info
    document.getElementById("miniSongTitle").textContent = title;
    document.getElementById("miniAlbumArt").src = albumArt;

    // Show fullscreen player
    document.getElementById("musicPlayer").style.display = "block";
    document.getElementById("minimizedPlayer").style.display = "none";

    // Play music
    document.getElementById("audioPlayer").play();
}

// Function to minimize the player
function minimizePlayer() {
    document.getElementById("musicPlayer").style.display = "none";
    document.getElementById("minimizedPlayer").style.display = "flex";
}

// Function to maximize the player
function maximizePlayer() {
    document.getElementById("musicPlayer").style.display = "block";
    document.getElementById("minimizedPlayer").style.display = "none";
}

// Like button functionality
document.getElementById("likeBtn").addEventListener("click", function() {
    this.style.color = this.style.color === "red" ? "white" : "red";
});

// Repeat button functionality
document.getElementById("repeatBtn").addEventListener("click", function() {
    let audio = document.getElementById("audioPlayer");
    audio.loop = !audio.loop;
    this.style.color = audio.loop ? "green" : "white";
});

// Toggle play/pause from minimized player
document.getElementById("miniPausePlay").addEventListener("click", function() {
    let audio = document.getElementById("audioPlayer");
    if (audio.paused) {
        audio.play();
        this.textContent = "⏸️";
    } else {
        audio.pause();
        this.textContent = "▶️";
    }
});

// Check if the user is you (Replace 'yourUsername' with your actual identifier)
const isUser = true;  // Change this logic based on authentication

// Show upload button only for you
if (isUser) {
    document.getElementById("uploadBtn").style.display = "block";
}

// Handle song upload
document.getElementById("songUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        addSongToList(file.name, objectURL);
    }
});

// Add uploaded song to the list
function addSongToList(title, songURL) {
    let songList = document.getElementById("trendingList");
    let newSong = document.createElement("li");
    newSong.textContent = "🎵 " + title;
    newSong.onclick = function () {
        openPlayer(title, "default.jpg", songURL);
    };
    songList.appendChild(newSong);
}

// Check if the user is an admin (Logged in via auth page)
const isAdmin = localStorage.getItem("isAdmin") === "true";

// Show upload button only for admin
if (isAdmin) {
    document.getElementById("uploadBtn").style.display = "block";
}

// Load saved songs when the page loads
document.addEventListener("DOMContentLoaded", function () {
    loadSavedSongs();
});

// Handle song upload
document.getElementById("songUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        addSongToLists(file.name, objectURL);
        saveSong(file.name, objectURL);
    }
});

// Function to add songs to Trending & Top Playlists
function addSongToLists(title, songURL) {
    let trendingList = document.getElementById("trendingList");
    let playlistList = document.getElementById("playlistList");

    let newSong = document.createElement("li");
    newSong.textContent = "🎵 " + title;
    newSong.onclick = function () {
        openPlayer(title, "default.jpg", songURL);
    };

    trendingList.appendChild(newSong);
    playlistList.appendChild(newSong.cloneNode(true)); // Clone for Top Playlists
}

// Function to save uploaded songs in localStorage
function saveSong(title, songURL) {
    let savedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    savedSongs.push({ title, songURL });
    localStorage.setItem("uploadedSongs", JSON.stringify(savedSongs));
}

// Function to load saved songs from localStorage
function loadSavedSongs() {
    let savedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    savedSongs.forEach(song => addSongToLists(song.title, song.songURL));
}

// Open music player with selected song
function openPlayer(title, albumArt, songFile) {
    document.getElementById("audioSource").src = songFile;
    document.getElementById("audioPlayer").load();
    document.getElementById("audioPlayer").play();
}
