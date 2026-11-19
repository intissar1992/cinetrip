let map = null;
let marker = null;

// Initialisation de la carte avec les tuiles gratuites CartoDB Voyager (zéro erreur 403)
function initMap() {
    map = L.map("map").setView([48.8566, 2.3522], 2);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19
    }).addTo(map);
}

// API 2 : Open-Meteo Geocoding (100% gratuit, sans clé API, ultra rapide)
async function fetchCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur lors de la recherche des coordonnées GPS.");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`Impossible de localiser "${cityName}" sur la carte.`);
    }

    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude
    };
}

// Mise à jour de la carte et du marqueur
function updateMapLocation(lat, lon, showTitle, placeLabel) {
    if (!map) initMap();
    map.invalidateSize();
    map.setView([lat, lon], 12);

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<strong>${showTitle}</strong><br>${placeLabel}`)
        .openPopup();
}

// API 3 : Open-Meteo Weather (météo actuelle en direct)
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Impossible de récupérer la météo sur place.");
    }

    const data = await response.json();
    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;

    let advice = "Température idéale pour visiter !";
    if (temp < 10) {
        advice = "🧥 Il fait froid sur le tournage, prévoyez un gros manteau.";
    } else if (temp > 25) {
        advice = "🕶️ Il fait chaud, n'oubliez pas vos lunettes de soleil.";
    }

    return { temperature: temp, windspeed: wind, advice: advice };
}