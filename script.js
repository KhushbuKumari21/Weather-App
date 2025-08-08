// OpenWeatherMap API key - replace with your own key for the app to work
const apiKey = '5493083a2759052f8925244406aec045';

// DOM element references for easy access and manipulation
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const recentCities = document.getElementById('recentCities');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

/**
 * Show the loading indicator while fetching data from the API
 */
function showLoading() {
  loading.classList.remove('hidden');
}

/**
 * Hide the loading indicator once data fetching is complete
 */
function hideLoading() {
  loading.classList.add('hidden');
}

/**
 * Display an error message on the UI
 * @param {string} msg - The error message to show
 */
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

/**
 * Clear any existing error messages from the UI
 */
function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

/**
 * Disable search and location buttons to prevent multiple requests during data fetch
 */
function disableButtons() {
  searchBtn.disabled = true;
  currentLocationBtn.disabled = true;
}

/**
 * Enable search and location buttons after data fetch completes
 */
function enableButtons() {
  searchBtn.disabled = false;
  currentLocationBtn.disabled = false;
}

/**
 * Save a searched city to localStorage for recent searches
 * Keeps only the 5 most recent unique cities
 * @param {string} city - The city name to save
 */
function updateRecentCities(city) {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  // Only add if city not already in the list
  if (!cities.includes(city)) {
    cities.unshift(city);           // Add to the start of array
    cities = cities.slice(0, 5);    // Keep only latest 5
    localStorage.setItem('recentCities', JSON.stringify(cities));
  }
  renderRecentCities();             // Update dropdown UI
}

/**
 * Render the recent cities dropdown menu based on saved localStorage data
 * If no cities are saved, hide the dropdown
 */
function renderRecentCities() {
  const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentCities.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join('');
  recentCities.classList.toggle('hidden', cities.length === 0);
}

/**
 * Fetch current weather and forecast data by city name
 * @param {string} city - The city to fetch weather data for
 */
function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  clearError();        // Remove any prior error messages
  showLoading();       // Show loading spinner/message
  disableButtons();    // Disable buttons to avoid multiple fetches

  // Fetch current weather data
  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      // If API returns an error, throw to catch below
      if (data.cod !== 200) throw new Error(data.message);
      displayCurrentWeather(data);  // Show current weather on UI
      updateRecentCities(city);     // Save city in recent searches
      cityInput.value = '';         // Clear input after search (optional enhancement)
      return fetch(forecastUrl);    // Fetch extended forecast next
    })
    .then(res => res.json())
    .then(displayForecast)           // Show 5-day forecast
    .catch(err => showError(err.message))  // Show error message
    .finally(() => {
      hideLoading();   // Hide loading spinner/message
      enableButtons(); // Enable buttons back
    });
}

/**
 * Fetch current weather and forecast data using geographic coordinates
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 */
function getWeatherByCoords(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  clearError();        // Remove any prior error messages
  showLoading();       // Show loading spinner/message
  disableButtons();    // Disable buttons during fetch

  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      displayCurrentWeather(data);   // Show current weather on UI
      updateRecentCities(data.name); // Save city name in recent searches
      return fetch(forecastUrl);
    })
    .then(res => res.json())
    .then(displayForecast)            // Show 5-day forecast
    .catch(err => showError(err.message))
    .finally(() => {
      hideLoading();  // Hide loading spinner/message
      enableButtons(); // Enable buttons back
    });
}

/**
 * Render the current weather data on the page
 * @param {object} data - API response data for current weather
 */
function displayCurrentWeather(data) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentWeather.innerHTML = `
    <h2 class="text-xl font-semibold mb-2">Current Weather in ${data.name}</h2>
    <img src="${iconUrl}" alt="${data.weather[0].description}" />
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
    <p>Condition: ${data.weather[0].description}</p>
  `;
}

/**
 * Display a 5-day weather forecast with date, icon, temperature, wind, and humidity
 * @param {object} data - API response data for forecast
 */
function displayForecast(data) {
  // Filter to forecast data around midday to represent each day
  const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  forecast.innerHTML = '<h2 class="text-lg font-semibold mb-2">5-Day Forecast</h2>' +
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
    dailyData.map(day => {
      const date = new Date(day.dt_txt).toLocaleDateString();
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
      return `
        <div class="border rounded p-2 shadow bg-gray-100 text-center">
          <h3 class="font-bold">${date}</h3>
          <div class="flex justify-center">
            <img src="${iconUrl}" alt="${day.weather[0].description}" class="w-12 h-12 object-contain mx-auto" />
          </div>
          <p>Temp: ${day.main.temp}°C</p>
          <p>Wind: ${day.wind.speed} m/s</p>
          <p>Humidity: ${day.main.humidity}%</p>
        </div>
      `;
    }).join('') + '</div>';
}

// Event listener: When user selects a city from recent cities dropdown
recentCities.addEventListener('change', () => {
  getWeather(recentCities.value);
});

// Event listener: When user clicks the Search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name');  // Validate input
    return;
  }
  getWeather(city);
});

// Event listener: When user clicks "Use My Location" button
currentLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => {
      showError('Could not get your location');
    }
  );
});

// Initialize the app by rendering any saved recent cities dropdown on page load
renderRecentCities();
