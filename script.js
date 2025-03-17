// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login with Google
document.getElementById("google-login").addEventListener("click", function() {
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        alert("Welcome " + result.user.displayName);
    }).catch(error => console.log(error.message));
});

// Search Functionality
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", function() {
    let query = searchBar.value.toLowerCase();
    let songs = document.querySelectorAll("#playlist-items li");
    songs.forEach(song => {
        if (song.textContent.toLowerCase().includes(query)) {
            song.style.display = "block";
        } else {
            song.style.display = "none";
        }
    });
});

// Sample Playlist
const playlist = [
    { title: "Birds Chirping", src: "birds.mp3" },
    { title: "Rainforest Sounds", src: "rainforest.mp3" }
];

const playlistContainer = document.getElementById("playlist-items");
playlist.forEach(song => {
    let li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
        document.getElementById("audio-player").src = song.src;
        document.getElementById("audio-player").play();
    });
    playlistContainer.appendChild(li);
});
