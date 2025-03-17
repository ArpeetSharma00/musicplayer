// Select elements
const audioPlayer = document.getElementById("audioPlayer");
const fileInput = document.getElementById("fileInput");
const searchBar = document.getElementById("searchBar");
const songList = document.getElementById("songList");
const albumArtContainer = document.getElementById("albumArtContainer");
const albumArtImg = document.getElementById("albumArtImg");

// Load saved songs but keep them hidden
let savedSongs = JSON.parse(localStorage.getItem("songs")) || [];

// Handle file upload for songs
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            const songData = { name: file.name, url: e.target.result, albumArt: "" };

            savedSongs.push(songData);
            localStorage.setItem("songs", JSON.stringify(savedSongs));
        };
    }
});

// Function to display search results
function displaySearchResults(query) {
    songList.innerHTML = ""; // Clear previous list
    savedSongs.forEach(song => {
        if (song.name.toLowerCase().includes(query.toLowerCase())) {
            const li = document.createElement("li");
            li.textContent = song.name;
            li.addEventListener("click", () => {
                audioPlayer.src = song.url;
                audioPlayer.play();
                updateAlbumArt(song.albumArt);
            });

            // ➖ Remove Button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "➖";
            removeBtn.style.marginLeft = "10px";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeSong(song.name);
                li.remove();
            });

            li.appendChild(removeBtn);
            songList.appendChild(li);
        }
    });
}

// Search bar functionality (reveals songs only when searched)
searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.trim();
    if (searchText.length > 0) {
        displaySearchResults(searchText);
    } else {
        songList.innerHTML = ""; // Keep list empty if no search
    }
});

// Remove song from local storage
function removeSong(songName) {
    savedSongs = savedSongs.filter(song => song.name !== songName);
    localStorage.setItem("songs", JSON.stringify(savedSongs));
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
