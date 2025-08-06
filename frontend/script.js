const movieContainer = document.getElementById("movieContainer"); // Container for movie cards
const genreFilter = document.getElementById("genreFilter"); // Genre filter dropdown
const searchBar = document.getElementById("searchBar"); // Search input

let pendingDeleteMovie = null; // Movie title pending deletion
let pendingAddMovie = null; // Movie pending addition to user's list

// Default set of movies to initialize localStorage
const DEFAULT_MOVIES = [
  // Each movie object with title, genre, description, image, rating, and voters
  { title: "The Batman", genre: "Action", description: "A gritty new take on the Dark Knight’s detective work.", image: "images/The Batman.jpg", rating: "★★★★☆", voters: "500k voters" },
  { title: "Everything Everywhere All at Once", genre: "Comedy", description: "A multiverse-hopping journey that’s both chaotic and heartfelt.", image: "images/Everything Everywhere All at Once.jpg", rating: "★★★★☆", voters: "450k voters" },
  { title: "Top Gun: Maverick", genre: "Action", description: "Pilot drama and nostalgia in a high-speed thrill ride.", image: "images/Top Gun Maverick.jpg", rating: "★★★★☆", voters: "700k voters" },
  { title: "Spider-Man: No Way Home", genre: "Action", description: "Peter Parker faces multiverse mayhem in this web-slinging epic.", image: "images/Spider-Man No Way Home.jpg", rating: "★★★★☆", voters: "800k voters" },
  { title: "The Super Mario Bros. Movie", genre: "Comedy", description: "Colorful animation and fun for fans of all ages.", image: "images/The Super Mario Bros. Movie.jpg", rating: "★★★☆☆", voters: "300k voters" },
  { title: "John Wick: Chapter 4", genre: "Action", description: "Non-stop martial arts and hitman lore.", image: "images/John Wick Chapter 4.jpg", rating: "★★★★☆", voters: "400k voters" },
  { title: "Dune: Part Two", genre: "Sci-Fi", description: "Political intrigue and desert prophecy continue in the saga.", image: "images/Dune Part Two.jpg", rating: "★★★★½", voters: "200k voters" },
  { title: "Barbie", genre: "Comedy", description: "A fun and feminist take on the classic doll.", image: "images/Barbie.jpg", rating: "★★★☆☆", voters: "350k voters" },
  { title: "Avengers: Endgame", genre: "Action", description: "Earth’s mightiest heroes unite in a grand finale.", image: "images/Avengers Endgame.jpg", rating: "★★★★☆", voters: "1M voters" },
  { title: "Oppenheimer", genre: "Drama", description: "Christopher Nolan explores the mind behind the A-bomb.", image: "images/Oppenheimer.jpg", rating: "★★★★☆", voters: "600k voters" }
];

// Initialize or merge localStorage movies with DEFAULT_MOVIES
let existing = JSON.parse(localStorage.getItem("movies")) || [];
const existingTitles = existing.map(m => m.title);
DEFAULT_MOVIES.forEach(movie => {
  if (!existingTitles.includes(movie.title)) {
    existing.push(movie);
  }
});
localStorage.setItem("movies", JSON.stringify(existing));

// Render movies on page based on filter and search input
function renderMovies() {
  const movies = JSON.parse(localStorage.getItem("movies")) || [];
  movieContainer.innerHTML = "";

  // Filter by genre and search text
  const filtered = movies.filter(m => {
    const matchGenre = genreFilter.value === "All" || m.genre === genreFilter.value;
    const matchSearch = m.title.toLowerCase().includes(searchBar.value.toLowerCase());
    return matchGenre && matchSearch;
  });

  // Create card elements for each filtered movie
  filtered.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const rating = movie.rating || "☆☆☆☆☆";
    const voters = movie.voters || "Not Rated";

    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" />
      <h4>${movie.title}</h4>
      <div class="stars">${rating} <span class="wlvotes">${voters}</span></div>
      <p>${movie.description}</p>
      <span class="genre-tag">${movie.genre}</span>
      <button class="add-btn">+ Add to My List</button>
      <button class="remove-btn">Remove</button>
    `;

    // Add event to open confirm add modal
    card.querySelector(".add-btn").addEventListener("click", () => {
      showAddConfirm(movie);
    });

    // Add event to open admin password prompt for deletion
    card.querySelector(".remove-btn").addEventListener("click", () => {
      showAdminPasswordPrompt("delete", movie.title);
    });

    movieContainer.appendChild(card);
  });
}

// Show temporary toast message
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.getElementById("toastContainer").appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Show admin password prompt modal, specify callback type (add/delete) and movie title
function showAdminPasswordPrompt(callbackType, movieTitle = null) {
  pendingDeleteMovie = movieTitle;
  document.getElementById("adminPassword").value = "";
  document.getElementById("passwordModal").style.display = "flex";
  document.getElementById("passwordModal").dataset.callback = callbackType;
}

// Handle admin password submission and call appropriate action
function handlePasswordSubmit() {
  const entered = document.getElementById("adminPassword").value;
  const type = document.getElementById("passwordModal").dataset.callback;

  if (entered === "admin123") {
    closePasswordModal();
    if (type === "delete" && pendingDeleteMovie) {
      showDeleteConfirm(pendingDeleteMovie);
    } else if (type === "add") {
      window.location.href = "admin.html";
    }
  } else {
    showToast("❌ Incorrect password.");
    closePasswordModal();
  }
}

// Close admin password modal and clear pending delete movie
function closePasswordModal() {
  document.getElementById("passwordModal").style.display = "none";
  pendingDeleteMovie = null;
}

// Show confirm deletion modal with movie title
function showDeleteConfirm(title) {
  pendingDeleteMovie = title;
  document.getElementById("confirmText").innerText = `Delete "${title}" from public list?`;
  document.getElementById("confirmModal").style.display = "flex";
}

// Close confirm deletion modal and clear pending delete movie
function closeConfirmModal() {
  document.getElementById("confirmModal").style.display = "none";
  pendingDeleteMovie = null;
}

// Show confirm add modal with movie info
function showAddConfirm(movie) {
  pendingAddMovie = movie;
  document.getElementById("addConfirmText").innerText = `Add "${movie.title}" to your list?`;
  document.getElementById("addConfirmModal").style.display = "flex";
}

// Close confirm add modal and clear pending add movie
function closeAddConfirm() {
  document.getElementById("addConfirmModal").style.display = "none";
  pendingAddMovie = null;
}

// Setup event handlers after DOM loads
window.onload = () => {
  // Confirm deletion: remove movie from both local movies and user list
  document.getElementById("confirmYes").onclick = () => {
    const title = pendingDeleteMovie;
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    movies = movies.filter(m => m.title !== title);
    localStorage.setItem("movies", JSON.stringify(movies));

    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    myList = myList.filter(m => m.title !== title);
    localStorage.setItem("myList", JSON.stringify(myList));

    closeConfirmModal();
    renderMovies();
    showToast(`✅ "${title}" removed successfully`);
  };

  // Confirm add: add movie to user's personal list if not already added
  document.getElementById("addConfirmYes").onclick = () => {
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    if (list.find(m => m.title === pendingAddMovie.title)) {
      showToast(`"${pendingAddMovie.title}" is already in your list.`);
    } else {
      list.push({ ...pendingAddMovie, status: "Not Started" });
      localStorage.setItem("myList", JSON.stringify(list));
      showToast(`✅ "${pendingAddMovie.title}" added to your list!`);
    }
    closeAddConfirm();
  };

  // Admin access button opens password prompt for adding movies
  document.getElementById("adminAccessBtn").onclick = () => {
    showAdminPasswordPrompt("add");
  };

  // Bind filter and search inputs to re-render movie list on change
  genreFilter.addEventListener("change", renderMovies);
  searchBar.addEventListener("input", renderMovies);

  // Initial render of movies
  renderMovies();
};
