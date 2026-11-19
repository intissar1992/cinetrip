const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const autocompleteList = document.getElementById("autocomplete-list");
const statusMessage = document.getElementById("status-message");
const showCard = document.getElementById("show-card");
const travelCard = document.getElementById("travel-card");
const shortcutButtons = document.querySelectorAll(".shortcut-btn");

initMap();

function showStatus(text, isError = false) {
    statusMessage.textContent = text;
    statusMessage.classList.remove("hidden", "error");
    if (isError) statusMessage.classList.add("error");
}

function hideStatus() {
    statusMessage.classList.add("hidden");
}

async function handleSearch(query) {
    if (!query) return;

    autocompleteList.classList.add("hidden");
    showCard.classList.add("hidden");
    travelCard.classList.add("hidden");
    showStatus(`🔍 Recherche de "${query}" et calcul du voyage...`);

    try {
        // 1. Appel API TVMaze
        const show = await fetchShowDetails(query);

        document.getElementById("show-poster").src = show.poster;
        document.getElementById("show-title").textContent = show.title;
        document.getElementById("show-country").textContent = `🌍 ${show.country}`;
        document.getElementById("show-genres").textContent = show.genres;
        document.getElementById("show-summary").textContent = show.summary;
        showCard.classList.remove("hidden");

        // 2. Appel API Open-Meteo Geocoding
        const coords = await fetchCoordinates(show.cityToSearch);

        // 3. Appel API Open-Meteo Forecast
        const weather = await fetchWeather(coords.lat, coords.lon);

        document.getElementById("target-location").textContent = show.displayLabel;
        document.getElementById("weather-temp").textContent =
            `🌡️ ${weather.temperature}°C | 💨 Vent : ${weather.windspeed} km/h`;
        document.getElementById("weather-advice").textContent = weather.advice;

        travelCard.classList.remove("hidden");
        updateMapLocation(coords.lat, coords.lon, show.title, show.displayLabel);

        hideStatus();
    } catch (error) {
        showStatus(`❌ ${error.message}`, true);
    }
}

let debounceTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (query.length < 2) {
        autocompleteList.classList.add("hidden");
        return;
    }

    debounceTimer = setTimeout(async () => {
        const suggestions = await searchShowSuggestions(query);
        autocompleteList.innerHTML = "";

        if (suggestions.length === 0) {
            autocompleteList.classList.add("hidden");
            return;
        }

        suggestions.forEach((show) => {
            const li = document.createElement("li");
            const year = show.premiered ? show.premiered.slice(0, 4) : "";
            li.innerHTML = `<span>${show.name}</span><small>${year}</small>`;

            li.addEventListener("click", () => {
                searchInput.value = show.name;
                autocompleteList.classList.add("hidden");
                handleSearch(show.name);
            });

            autocompleteList.appendChild(li);
        });

        autocompleteList.classList.remove("hidden");
    }, 300);
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
        autocompleteList.classList.add("hidden");
    }
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearch(searchInput.value.trim());
});

shortcutButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const showName = btn.dataset.show;
        searchInput.value = showName;
        handleSearch(showName);
    });
});