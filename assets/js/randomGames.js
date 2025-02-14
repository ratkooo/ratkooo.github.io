// Function to get filters from localStorage and build the API URL
const buildApiUrl = () => {
    const baseUrl = 'https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games?';
    
    const genre = localStorage.getItem('selectedGenre') || 'any';
    const platform = localStorage.getItem('selectedPlatform') || 'any';
    const developer = localStorage.getItem('selectedDeveloper') || 'any';
    const publisher = localStorage.getItem('selectedPublisher') || 'any';
    const releaseYear = localStorage.getItem('selectedReleaseYear') || 'any';

    // Construct the API URL without applying filters to fetch all games
    const apiUrl = `${baseUrl}${platform !== 'any' ? `platform=${platform}&` : ''}${releaseYear !== 'any' ? `release_year=${releaseYear}&` : ''}`;
    
    console.log('Constructed API URL:', apiUrl); // Check the generated URL
    return apiUrl;
};

// Function to fetch all games and filter them based on selected attributes
const fetchFilteredGames = () => {
    const apiUrl = buildApiUrl();
    console.log('Fetching from:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) {
                console.error('Error fetching games:', data.status_message);
                return;
            }

            // Get the selected filter values
            const selectedGenre = localStorage.getItem('selectedGenre') || 'any';
            const selectedPlatform = localStorage.getItem('selectedPlatform') || 'any';
            const selectedDeveloper = localStorage.getItem('selectedDeveloper') || 'any';
            const selectedPublisher = localStorage.getItem('selectedPublisher') || 'any';
            const selectedReleaseYear = localStorage.getItem('selectedReleaseYear') || 'any';

            // Filter games based on the selected attributes
            const filteredGames = data.filter(game => {
                const genreMatch = selectedGenre === 'any' || game.genre.toLowerCase().includes(selectedGenre.toLowerCase());
                const platformMatch = selectedPlatform === 'any' || game.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
                const developerMatch = selectedDeveloper === 'any' || game.developer.toLowerCase().includes(selectedDeveloper.toLowerCase());
                const publisherMatch = selectedPublisher === 'any' || game.publisher.toLowerCase().includes(selectedPublisher.toLowerCase());
                const releaseYearMatch = selectedReleaseYear === 'any' || game.release_date.includes(selectedReleaseYear);

                return genreMatch && platformMatch && developerMatch && publisherMatch && releaseYearMatch;
            });

            // Shuffle the filtered games and pick 10 random games
            const shuffledGames = shuffleArray(filteredGames).slice(0, 10);
            console.log('Filtered Random Games:', shuffledGames);

            // Display the games
            displayGames(shuffledGames);
        })
        .catch(error => console.error('Error fetching games:', error));
};

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

// Function to display games in the HTML
const displayGames = (games) => {
    const gamesContainer = document.getElementById('gamesContainer');

    // Check if the gamesContainer element exists
    if (!gamesContainer) {
        console.error('gamesContainer element not found');
        return;
    }

    gamesContainer.innerHTML = ''; // Clear previous content

    games.forEach(game => {
        // Create a link to the game's URL
        const gameLink = document.createElement('a');
        gameLink.href = game.game_url;
        gameLink.target = '_blank'; // Open in a new tab
        gameLink.classList.add('game-card', 'block', 'rounded-lg', 'overflow-hidden', 'shadow-md', 'transition-all', 'hover:scale-105');

        // Create the game card
        const gameCard = document.createElement('div');
        gameCard.classList.add('bg-white', 'p-4');

        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-48 object-cover rounded-lg">
            <h2 class="text-xl font-bold mt-4">${game.title}</h2>
            <p class="mt-2 text-gray-600">${game.short_description}</p>
            <p class="mt-4 text-sm text-gray-400">Platform: ${game.platform}</p>
        `;

        // Append the game card inside the link
        gameLink.appendChild(gameCard);

        // Append the link to the games container
        gamesContainer.appendChild(gameLink);
    });
};

// Fetch games when the page loads
document.addEventListener('DOMContentLoaded', fetchFilteredGames);
