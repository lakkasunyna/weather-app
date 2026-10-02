async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    try {
        errorMessage.textContent = "Loading...";

        // Find city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            errorMessage.textContent = "City not found.";
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Display city
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        // Display temperature
        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        // Display humidity
        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        // Display wind speed
        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        // Weather description and icon
        const weather = getWeatherDescription(current.weather_code);

        document.getElementById("description").textContent =
            weather.description;

        document.getElementById("weatherIcon").textContent =
            weather.icon;

        errorMessage.textContent = "";

    } catch (error) {
        console.error(error);
        errorMessage.textContent =
            "Unable to get weather information.";
    }
}


// Convert weather code into description and emoji
function getWeatherDescription(code) {

    if (code === 0) {
        return {
            description: "Clear sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁️"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            description: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            description: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            description: "Rain showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown",
        icon: "🌡️"
    };
}