// Select elements
const audioPlayer = document.getElementById("audioPlayer");
const fileInput = document.getElementById("fileInput");
const songList = document.getElementById("songList");
const albumArtContainer = document.getElementById("albumArtContainer");
const albumArtImg = document.getElementById("albumArtImg");
const lyricsText = document.getElementById("lyricsText");
const fish = document.getElementById("fish");
const progressBar = document.getElementById("progressBar");

// Load saved songs and album art from localStorage
window.addEventListener("load", () => {
    const savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
    savedSongs.forEach(song => addSongToList(song.name, song.url, song.albumArt));

    if (savedSongs.length > 0) {
        audioPlayer.src = savedSongs[0].url;
        updateAlbumArt(savedSongs[0].albumArt);
    }
});

// Handle file upload for songs
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            const songData = { name: file.name, url: e.target.result, albumArt: "" };

            let savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
            savedSongs.push(songData);
            localStorage.setItem("songs", JSON.stringify(savedSongs));

            addSongToList(songData.name, songData.url, songData.albumArt);
        };
    }
});

// Add song to the list
function addSongToList(name, url, albumArt) {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => {
        audioPlayer.src = url;
        audioPlayer.play();
        updateAlbumArt(albumArt);
    });

    // Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent playing when clicking remove
        removeSong(name);
        li.remove();
    });

    li.appendChild(removeBtn);
    songList.appendChild(li);
}

// Remove song from local storage
function removeSong(songName) {
    let savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
    savedSongs = savedSongs.filter(song => song.name !== songName);
    localStorage.setItem("songs", JSON.stringify(savedSongs));
}

// Clear all songs
function clearAllSongs() {
    localStorage.removeItem("songs");
    songList.innerHTML = "";
    audioPlayer.src = "";
    updateAlbumArt("");
}

// Click on album art container to upload a separate album art
albumArtContainer.addEventListener("click", () => {
    const albumInput = document.createElement("input");
    albumInput.type = "file";
    albumInput.accept = "image/*";
    albumInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                updateAlbumArt(e.target.result);

                // Save album art for the currently playing song
                let savedSongs = JSON.parse(localStorage.getItem("songs")) || [];
                savedSongs = savedSongs.map(song => 
                    song.url === audioPlayer.src ? { ...song, albumArt: e.target.result } : song
                );
                localStorage.setItem("songs", JSON.stringify(savedSongs));
            };
        }
    });
    albumInput.click();
});

// Update album art display
function updateAlbumArt(imageSrc) {
    if (imageSrc) {
        albumArtImg.src = imageSrc;
    } else {
        albumArtImg.src = "default_album.png"; // Use a default image
    }
}

// Sync lyrics with song playback
function updateLyrics() {
    const currentTime = audioPlayer.currentTime;
    const songFileName = audioPlayer.src.split('/').pop();

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

    lyricsText.innerHTML = `<p>${currentLine}</p>`;

    // Move the fish across the lyrics
    fish.style.transform = `translateX(-50%) translateY(${Math.min(currentLine.length * -1, -10)}px)`;
}

// Sync progress bar with ocean wave effect
audioPlayer.addEventListener("timeupdate", () => {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.backgroundPosition = `${percentage}% 50%`;
    updateLyrics();
});

// Play and pause button
document.getElementById("playPauseBtn").addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
});
