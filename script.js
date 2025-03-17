// Function to open the music player
function openPlayer(title, albumArt, songFile) {
    document.getElementById("songTitle").textContent = title;
    document.getElementById("albumArt").src = albumArt;
    document.getElementById("audioSource").src = songFile;
    document.getElementById("audioPlayer").load();
    document.getElementById("musicPlayer").style.display = "block";
}

// Function to close the player
function closePlayer() {
    document.getElementById("musicPlayer").style.display = "none";
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

// Progress bar functionality
let audioPlayer = document.getElementById("audioPlayer");
let progressBar = document.getElementById("progressBar");

audioPlayer.addEventListener("timeupdate", function() {
    let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress || 0;
});

progressBar.addEventListener("input", function() {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});
