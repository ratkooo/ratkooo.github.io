// Fetch data from the FreeToGame API
fetch('https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games')
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

        // Populate genre selection bar
        const genreSelect = document.getElementById('genre');
        addAnyOption(genreSelect);
        const genres = new Set(); // Using a Set to avoid duplicate genres
        data.forEach(game => genres.add(game.genre));

        populateSortedDropdown(genreSelect, genres);

        // Populate platform selection bar
        const platformSelect = document.getElementById('platform');
        addAnyOption(platformSelect);
        const platforms = new Set(); // Using a Set to avoid duplicate platforms
        data.forEach(game => platforms.add(game.platform));

        populateSortedDropdown(platformSelect, platforms);

        // Populate developer selection bar
        const developerSelect = document.getElementById('developer');
        addAnyOption(developerSelect);
        const developers = new Set(); // Using a Set to avoid duplicate developers
        data.forEach(game => developers.add(game.developer));

        populateSortedDropdown(developerSelect, developers);

        // Populate publisher selection bar
        const publisherSelect = document.getElementById('publisher');
        addAnyOption(publisherSelect);
        const publishers = new Set(); // Using a Set to avoid duplicate publishers
        data.forEach(game => publishers.add(game.publisher));

        populateSortedDropdown(publisherSelect, publishers);

        // Populate release-year selection bar with only years and filter games based on selected year
        const releaseYearSelect = document.getElementById('release-year');
        addAnyOption(releaseYearSelect);
        const years = new Set();
        data.forEach(game => {
            const year = new Date(game.release_date).getFullYear(); // Extract the year from release date
            if (year) {
                years.add(year);
            }
        });

        // Add the years to the dropdown (sorted by newest first)
        const sortedYears = Array.from(years).sort((a, b) => b - a); // Sort in descending order
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            releaseYearSelect.appendChild(option);
        });

        // Add event listener to filter games based on selected year
        releaseYearSelect.addEventListener('change', (e) => {
            const selectedYear = parseInt(e.target.value);
            const filteredGames = data.filter(game => {
                const gameYear = new Date(game.release_date).getFullYear();
                return gameYear >= selectedYear; // Show games that were released in the selected year or newer
            });

            // You can add the logic to display the filtered games here
            console.log(filteredGames); // This will log the filtered games, you can display them in your UI
        });

        // Function to save the selected filters to localStorage
        // Function to save the selected filters to localStorage
        const saveFilters = () => {
            const genre = document.getElementById('genre').value;
            const platform = document.getElementById('platform').value;
            const developer = document.getElementById('developer').value;
            const publisher = document.getElementById('publisher').value;
            const releaseYear = document.getElementById('release-year').value;

            localStorage.setItem('selectedGenre', genre);
            localStorage.setItem('selectedPlatform', platform);
            localStorage.setItem('selectedDeveloper', developer);
            localStorage.setItem('selectedPublisher', publisher);
            localStorage.setItem('selectedReleaseYear', releaseYear);
        };

        // Event listener for the search button
        document.getElementById('searchButton').addEventListener('click', () => {
            saveFilters();  // Save the selected filters to localStorage
            window.location.href = "randomgames.html";  // Redirect to randomgames.html
        });

    })
    .catch(error => console.error('Error fetching games:', error));
