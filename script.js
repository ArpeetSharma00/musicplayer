document.getElementById("searchBar").addEventListener("input", function() {
    let query = this.value.toLowerCase();
    let songs = document.querySelectorAll("#trendingList li");

    songs.forEach(song => {
        song.style.display = song.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
});
