**Weather Forecast App**
A simple and responsive web application that provides current weather and a 5-day weather forecast using the OpenWeatherMap API. Users can search by city name or use their current location. The app also stores recent searches and displays weather conditions with appropriate icons.


**Features**
Search weather by city name
Get weather using current location (geolocation)
Dropdown menu for recently searched cities (up to 5)
5-day weather forecast with date, temperature, wind speed, humidity, and weather icons
Responsive design supporting desktop, iPad Mini, and iPhone SE screen sizes
Input validation and error handling with clear messages
Styled using Tailwind CSS along with custom CSS for better user experience

**Technologies Used**
HTML5
CSS3 (Tailwind CSS + custom CSS)
JavaScript (ES6+)
OpenWeatherMap API

**Setup and Usage**
# 1.Clone the repository:
git clone https://github.com/KhushbuKumari21/Weather-App.git
cd Weather-App

# 2.Get an OpenWeatherMap API key:
Sign up at OpenWeatherMap and generate your API key.

# 3.Add your API key:
Open script.js and replace the apiKey variable value with  own API key
const apiKey = '5493083a2759052f8925244406aec045';

# 4.Open the application:
Open index.html in your preferred web browser.


**Usage Instructions**
Enter a city name and click Search to view current and forecasted weather.
Click Use My Location to get weather data for your current location.
Previously searched cities will appear in a dropdown for quick access.
Invalid inputs or API errors will trigger helpful error messages.
Fully responsive layout for different screen sizes.

**Version Control & GitHub**
This project uses Git for version control.
Commit history tracks changes made during development.
Make sure to commit after adding significant features or fixes.
This project uses Git for version control and is hosted on GitHub.

**Git Workflow Used:**

# Initialize Git (only for local projects)
git init
# Stage all files
git add .
# Commit with message
git commit -m "Initial commit for weather forecast app"
# Set branch name
git branch -M main
# Add GitHub remote
git remote add origin https://github.com/KhushbuKumari21/Weather-App.git
# Push to GitHub
git push -u origin main

**Notes**
An active internet connection is required for API calls and loading CDN resources.
Geolocation permission must be granted by the user to fetch location-based weather.

