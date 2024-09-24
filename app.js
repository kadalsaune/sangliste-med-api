const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const favoriteSongsList = document.getElementById('favorite-songs');
const favoriteAlbumCovers = document.getElementById('favorite-album-covers');

// Hent favorittsanger fra localStorage
let favoriteSongs = JSON.parse(localStorage.getItem('favoriteSongs')) || [];
console.log(favoriteSongs)
// Vis favorittsanger i listen og bildeserie
function renderFavoriteSongs() {
    favoriteSongsList.innerHTML = '';
    favoriteAlbumCovers.innerHTML = '';

    favoriteSongs.forEach(song => {
        // Legg til sang i listen
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist.name}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.className = 'ml-2 bg-red-500 text-white text-xs rounded p-1 pt-0 pb-0';
        removeButton.onclick = () => {
            removeFavoriteSong(song.id);
        };
        
        li.appendChild(removeButton);
        favoriteSongsList.appendChild(li);

        // Legg til albumcover i bildeserien
        const img = document.createElement('img');
        img.src = song.artist.picture;
        img.alt = `${song.title} album cover`;
        img.className = 'h-16 w-16 object-cover m-1 rounded';
        favoriteAlbumCovers.appendChild(img);
    });
}

// Legg til sang i favoritter
function addFavoriteSong(song) {
    if (!favoriteSongs.some(favSong => favSong.id === song.id)) {
        favoriteSongs.push(song);
        localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
        renderFavoriteSongs();
    } else {
        alert('Sangen er allerede i favoritter!');
    }
}

// Fjern sang fra favoritter
function removeFavoriteSong(songId) {
    favoriteSongs = favoriteSongs.filter(song => song.id !== songId);
    localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
    renderFavoriteSongs();
}

// Søk etter sanger
async function searchSong() {
    const query = searchInput.value;
    if (!query) return;

    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    searchResults.innerHTML = '';
    data.data.forEach(song => {
        const div = document.createElement('div');
        div.className = 'border p-2 mt-2 rounded flex items-center';
        
        const title = document.createElement('h2');
        title.textContent = `${song.title} - ${song.artist.name}`;
        title.className = 'flex-1';
        
        const albumCover = document.createElement('img');
        albumCover.src = song.album.cover;
        albumCover.alt = `${song.title} album cover`;
        albumCover.className = 'h-16 w-16 object-cover mr-2 rounded';
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Legg til i favoritter';
        addButton.className = 'ml-2 bg-green-500 text-white rounded p-1';
        addButton.onclick = () => {
            addFavoriteSong({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album
            });
        };
        
        div.appendChild(albumCover);
        div.appendChild(title);
        div.appendChild(addButton);
        searchResults.appendChild(div);
    });
}

// Legg til event listener for søk-knappen
searchButton.addEventListener('click', searchSong);

// Render favorittsanger når siden lastes
renderFavoriteSongs();
