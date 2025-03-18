const isAdmin = localStorage.getItem("isAdmin") === "true";

if (isAdmin) {
    document.getElementById("uploadBtn").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    loadSavedSongs();
});

document.getElementById("songUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        addSongToLists(file.name, objectURL);
        saveSong(file.name, objectURL);
    }
});

function addSongToLists(title, songURL) {
    let trendingList = document.getElementById("trendingList");
    let playlistList = document.getElementById("playlistList");

    let newSong = document.createElement("li");
    newSong.textContent = "🎵 " + title;
    newSong.classList.add("song-item");
    newSong.onclick = function () {
        openPlayer(title, "default.jpg", songURL);
    };

    trendingList.appendChild(newSong);
    playlistList.appendChild(newSong.cloneNode(true));
}

function saveSong(title, songURL) {
    let savedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    savedSongs.push({ title, songURL });
    localStorage.setItem("uploadedSongs", JSON.stringify(savedSongs));
}

function loadSavedSongs() {
    let savedSongs = JSON.parse(localStorage.getItem("uploadedSongs")) || [];
    savedSongs.forEach(song => addSongToLists(song.title, song.songURL));
}

function openPlayer(title, albumArt, songFile) {
    document.getElementById("songTitle").textContent = title;
    document.getElementById("albumArt").src = albumArt;
    document.getElementById("audioSource").src = songFile;
    document.getElementById("audioPlayer").load();
    document.getElementById("audioPlayer").play();
    document.getElementById("musicPlayer").classList.remove("hidden");
}

document.getElementById("closePlayer").addEventListener("click", function () {
    document.getElementById("musicPlayer").classList.add("hidden");
});

function logout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "auth.html";
}
