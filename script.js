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
