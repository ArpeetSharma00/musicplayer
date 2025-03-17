const fileInput = document.getElementById("fileInput");
const audio = document.getElementById("audio-player");
const songTitle = document.getElementById("song-title");
const albumArt = document.getElementById("album-art");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

let songs = [];
let currentSong = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Open IndexedDB
let db;
const request = indexedDB.open("MusicDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("songs", { keyPath: "title" });
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadSongsFromDB();
};

request.onerror = function () {
    console.error("Failed to open IndexedDB");
};

// Load songs from IndexedDB
function loadSongsFromDB() {
    const transaction = db.transaction("songs", "readonly");
    const store = transaction.objectStore("songs");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        songs = getAll.result;
        if (songs.length > 0) {
            loadSong(0);
        }
    };
}

// Save song to IndexedDB
function saveSongToDB(song) {
    const transaction = db.transaction("songs", "readwrite");
    const store = transaction.objectStore("songs");
    store.put(song);
}

// Load a song
function loadSong(index) {
    if (songs.length === 0) return;
    songTitle.textContent = songs[index].title;
    albumArt.src = songs[index].image || "default-cover.jpg";

    // Convert blob to URL
    const blob = songs[index].src;
    const url = URL.createObjectURL(blob);
    audio.src = url;
}

// Handle play/pause
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

// Next & Previous
function nextSong() {
    currentSong = isShuffle ? Math.floor(Math.random() * songs.length) : (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audio.play();
}
function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play();
}

// Shuffle & Repeat
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.background = isShuffle ? "lightgreen" : "white";
}
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.background = isRepeat ? "lightgreen" : "white";
}
audio.onended = () => (isRepeat ? audio.play() : nextSong());

// File input handling
fileInput.addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        for (let file of files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (e) {
                const blob = new Blob([e.target.result], { type: file.type });

                const songData = {
                    title: file.name,
                    src: blob, // Store file as a blob
                    image: "default-cover.jpg",
                };

                songs.push(songData);
                saveSongToDB(songData);
                if (songs.length === 1) loadSong(0);
            };
        }
    }
});

// Add event listeners
playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);

fileInput.addEventListener("change", function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        for (let file of files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (e) {
                const blob = new Blob([e.target.result], { type: file.type });

                // Read metadata using jsmediatags
                jsmediatags.read(file, {
                    onSuccess: function (tag) {
                        let albumArt = "default-cover.jpg"; // Default cover if no image is found
                        if (tag.tags.picture) {
                            let picture = tag.tags.picture;
                            let imageData = picture.data;
                            let format = picture.format;
                            let base64String = "";
                            for (let i = 0; i < imageData.length; i++) {
                                base64String += String.fromCharCode(imageData[i]);
                            }
                            albumArt = `data:${format};base64,${btoa(base64String)}`;
                        }

                        const songData = {
                            title: file.name,
                            src: blob, // Store file as a blob
                            image: albumArt, // Extracted album art
                        };

                        songs.push(songData);
                        saveSongToDB(songData);
                        if (songs.length === 1) loadSong(0);
                    },
                    onError: function (error) {
                        console.log("Error reading metadata: ", error);
                    }
                });
            };
        }
    }
});

document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            songs[currentSong].image = e.target.result;
            albumArt.src = e.target.result;
            saveSongToDB(songs[currentSong]); // Save updated song data
        };
    }
});

// Repeat Toggle
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active");
});

// Progress Bar Update
audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
});

// Seek Song
progressBar.addEventListener("input", (e) => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

