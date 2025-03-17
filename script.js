// Select elements
const audioPlayer = document.getElementById("audioPlayer");
const fileInput = document.getElementById("fileInput");
const songList = document.getElementById("songList");
const albumArtContainer = document.getElementById("albumArtContainer");
const albumArtImg = document.getElementById("albumArtImg");
const lyricsText = document.getElementById("lyricsText");
const leaf = document.getElementById("leaf");
const progressBar = document.getElementById("progressBar");
const searchBar = document.getElementById("searchBar");

// Load saved songs from localStorage
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

// Add song to list
function addSongToList(name, url, albumArt) {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => {
        audioPlayer.src = url;
        audioPlayer.play();
        updateAlbumArt(albumArt);
    });

    // ➖ Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "➖";
    removeBtn.style.marginLeft = "10px";
    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
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

// Upload album art separately
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

// Update album art
function updateAlbumArt(imageSrc) {
    albumArtImg.src = imageSrc || "default_album.png";
}

// Search bar functionality
searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.toLowerCase();
    Array.from(songList.children).forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(searchText) ? "block" : "none";
    });
});
