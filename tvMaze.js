// Villes emblématiques associées aux séries célèbres
const ICONIC_CITIES = {
    "lupin": { city: "Paris", label: "Paris (Musée du Louvre), France" },
    "emily in paris": { city: "Paris", label: "Paris (Place de l'Estrapade), France" },
    "sherlock": { city: "London", label: "Londres (Baker Street), Royaume-Uni" },
    "stranger things": { city: "Atlanta", label: "Atlanta (Géorgie), États-Unis" },
    "la casa de papel": { city: "Madrid", label: "Madrid (Fabrique de la Monnaie), Espagne" },
    "money heist": { city: "Madrid", label: "Madrid (Fabrique de la Monnaie), Espagne" },
    "dark": { city: "Berlin", label: "Berlin, Allemagne" },
    "game of thrones": { city: "Dubrovnik", label: "Dubrovnik (Port-Réal), Croatie" },
    "breaking bad": { city: "Albuquerque", label: "Albuquerque (Nouveau-Mexique), États-Unis" }
};

// Correspondance pays -> capitale pour les autres séries
const COUNTRY_CAPITALS = {
    "France": "Paris",
    "United Kingdom": "London",
    "United States": "New York",
    "Spain": "Madrid",
    "Germany": "Berlin",
    "Japan": "Tokyo",
    "South Korea": "Seoul",
    "Canada": "Toronto",
    "Italy": "Rome",
    "Argentina": "Buenos Aires",
    "Australia": "Sydney"
};

// Auto-complétion en direct
async function searchShowSuggestions(query) {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const results = await response.json();
    return results.slice(0, 6).map(item => item.show);
}

// Récupération de la fiche de la série
async function fetchShowDetails(query) {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur de connexion à l'API TVMaze.");
    }

    const results = await response.json();
    if (!results || results.length === 0) {
        throw new Error(`Aucune série trouvée pour "${query}".`);
    }

    // On privilégie la série qui possède une affiche et un résumé (évite les doublons peu connus)
    const bestMatch =
        results.find(r => r.show.image && r.show.summary) || results[0];
    const data = bestMatch.show;

    const country =
        data.network?.country?.name ||
        data.webChannel?.country?.name ||
        "France";

    const cleanSummary = data.summary
        ? data.summary.replace(/<[^>]*>?/gm, "").trim()
        : "Aucun résumé disponible pour cette œuvre.";

    const normalizedQuery = query.toLowerCase().trim();
    const normalizedTitle = data.name.toLowerCase().trim();
    const knownSpot = ICONIC_CITIES[normalizedTitle] || ICONIC_CITIES[normalizedQuery];

    const cityToSearch = knownSpot ? knownSpot.city : (COUNTRY_CAPITALS[country] || country);
    const displayLabel = knownSpot ? knownSpot.label : `${cityToSearch}, ${country}`;

    return {
        title: data.name,
        poster: data.image?.medium || "https://via.placeholder.com/210x295?text=Pas+d+affiche",
        country: country,
        genres: data.genres?.length ? data.genres.join(", ") : "Série TV",
        summary: cleanSummary,
        cityToSearch: cityToSearch,
        displayLabel: displayLabel
    };
}