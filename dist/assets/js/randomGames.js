// Fetch data from the FreeToGame API via RapidAPI
fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aea68523f5msh37375284730d652p16b318jsn1e2a1607c4ea',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
})
    .then(response => response.json())
    .then(data => {
        // Add 'ANY' as the default option for filtering
        const addAnyOption = (selectElement) => {
            const anyOption = document.createElement('option');
            anyOption.value = 'any';
            anyOption.textContent = 'Any';
            selectElement.appendChild(anyOption);
        };

        // Function to sort a Set alphabetically and append options to the dropdown
        const populateSortedDropdown = (selectElement, itemsSet) => {
            const sortedItems = Array.from(itemsSet).sort((a, b) => a.localeCompare(b)); // Sort alphabetically
            sortedItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item.toLowerCase();
                option.textContent = item;
                selectElement.appendChild(option);
            });
        };

        // Function to create and populate dropdowns with sorted data
        const populateDropdowns = () => {
            const genrePromise = new Promise((resolve) => {
                const genreSelect = document.getElementById('genre');
                addAnyOption(genreSelect);
                const genres = new Set();
                data.forEach(game => genres.add(game.genre));
                populateSortedDropdown(genreSelect, genres);
                resolve('Genres populated');
            });

            const developerPromise = new Promise((resolve) => {
                const developerSelect = document.getElementById('developer');
                addAnyOption(developerSelect);
                const developers = new Set();
                data.forEach(game => developers.add(game.developer));
                populateSortedDropdown(developerSelect, developers);
                resolve('Developers populated');
            });

            const publisherPromise = new Promise((resolve) => {
                const publisherSelect = document.getElementById('publisher');
                addAnyOption(publisherSelect);
                const publishers = new Set();
                data.forEach(game => publishers.add(game.publisher));
                populateSortedDropdown(publisherSelect, publishers);
                resolve('Publishers populated');
            });

            // Execute all promises concurrently using Promise.all
            return Promise.all([genrePromise, developerPromise, publisherPromise]);
        };

        // Call the function to populate the dropdowns
        populateDropdowns()
            .then((messages) => {
                console.log(messages);
            })
            .catch(error => {
                console.error('Error while populating dropdowns:', error);
            });

        // Function to save the selected filters to localStorage
        const saveFilters = () => {
            const genre = document.getElementById('genre').value;
            const developer = document.getElementById('developer').value;
            const publisher = document.getElementById('publisher').value;

            localStorage.setItem('selectedGenre', genre);
            localStorage.setItem('selectedDeveloper', developer);
            localStorage.setItem('selectedPublisher', publisher);
        };

        // Event listener for the search button
        document.getElementById('searchButton').addEventListener('click', () => {
            saveFilters();
            window.location.href = "randomgames.html";
        });

    })
    .catch(error => console.error('Error fetching games:', error));

// Function to fetch all games and filter them based on selected attributes
const fetchFilteredGames = () => {
    const apiUrl = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
    console.log('Fetching from:', apiUrl);

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aea68523f5msh37375284730d652p16b318jsn1e2a1607c4ea',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) {
                console.error('Error fetching games:', data.status_message);
                return;
            }

            // Get the selected filter values
            const selectedGenre = localStorage.getItem('selectedGenre') || 'any';
            const selectedDeveloper = localStorage.getItem('selectedDeveloper') || 'any';
            const selectedPublisher = localStorage.getItem('selectedPublisher') || 'any';

            // Filter games based on the selected attributes
            const filteredGames = data.filter(game => {
                const genreMatch = selectedGenre === 'any' || game.genre.toLowerCase().includes(selectedGenre.toLowerCase());
                const developerMatch = selectedDeveloper === 'any' || game.developer.toLowerCase().includes(selectedDeveloper.toLowerCase());
                const publisherMatch = selectedPublisher === 'any' || game.publisher.toLowerCase().includes(selectedPublisher.toLowerCase());

                return genreMatch && developerMatch && publisherMatch;
            });

            // Shuffle the filtered games and pick 10 random games
            const shuffledGames = shuffleArray(filteredGames).slice(0, 9);
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
        [array[i], array[j]] = [array[j], array[i]];
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

    gamesContainer.innerHTML = '';

    games.forEach(game => {
        // Create a link to the game's URL
        const gameLink = document.createElement('a');
        gameLink.href = game.game_url;
        gameLink.target = '_blank';
        gameLink.classList.add('game-card', 'block', 'rounded-lg', 'overflow-hidden', 'shadow-md', 'transition-all', 'hover:scale-105');

        // Create the game card
        const gameCard = document.createElement('div');
        gameCard.classList.add('bg-white', 'p-4');

        // Add the game details, including the release date
        gameCard.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-48 object-cover rounded-lg">
            <h2 class="text-xl font-bold mt-4">${game.title}</h2>
            <p class="mt-2 text-gray-600">${game.short_description}</p>
            <p class="mt-4 text-sm text-gray-400">Platform: ${game.platform}</p>
            <p class="mt-4 text-sm text-gray-400">Release Date: ${game.release_date ? game.release_date : 'N/A'}</p>
        `;

        // Append the game card inside the link
        gameLink.appendChild(gameCard);

        // Append the link to the games container
        gamesContainer.appendChild(gameLink);
    });
};

// Initial fetch of games
fetchFilteredGames();

// Event listener for the "Generate Other Games" button
const generateOtherGamesButton = document.getElementById('generateOtherGamesButton');
if (generateOtherGamesButton) {
    generateOtherGamesButton.addEventListener('click', () => {
        window.scrollTo(0, 0);
        fetchFilteredGames();
    });
}
