const form = document.querySelector("#weather-form");
const input = document.querySelector("#city-name");
const resultPanel = document.querySelector("#result-panel");
const statusMessage = document.querySelector("#status-message");
const cityName = document.querySelector("#city-data");
const cityTime = document.querySelector("#city-time");
const conditionText = document.querySelector("#condition-text");
const conditionIcon = document.querySelector("#condition-icon");
const tempText = document.querySelector("#temp");
const feelsLikeText = document.querySelector("#feelslike");
const humidityText = document.querySelector("#humidity");
const windText = document.querySelector("#wind");
const uvIndexText = document.querySelector("#uv-index");

const API_KEY = "6cc5401ac6f64e75939104741260704";
const API_URL = "https://api.weatherapi.com/v1/current.json";

function showMessage(message, type = "info") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
}

function clearMessage() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}

function updateWeather(result) {
    const { location, current } = result;
    cityName.textContent = `${location.name}, ${location.region} • ${location.country}`;
    cityTime.textContent = `Local time: ${location.localtime}`;
    conditionText.textContent = current.condition.text;
    conditionIcon.src = `https:${current.condition.icon}`;
    conditionIcon.alt = current.condition.text;

    tempText.textContent = `${current.temp_c.toFixed(1)}°C / ${current.temp_f.toFixed(1)}°F`;
    feelsLikeText.textContent = `${current.feelslike_c.toFixed(1)}°C`; 
    humidityText.textContent = `${current.humidity}%`;
    windText.textContent = `${current.wind_kph.toFixed(1)} km/h`;
    uvIndexText.textContent = current.uv.toString();
    resultPanel.classList.remove("hidden");
}

async function getData(city) {
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`);

    if (!response.ok) {
        throw new Error("Unable to retrieve weather data. Please try again.");
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || "City not found.");
    }

    return data;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = input.value.trim();
    if (!city) {
        showMessage("Enter a city name to search.", "warning");
        resultPanel.classList.add("hidden");
        return;
    }

    showMessage("Fetching weather details...", "info");
    resultPanel.classList.add("hidden");

    try {
        const weather = await getData(city);
        updateWeather(weather);
        clearMessage();
    } catch (error) {
        showMessage(error.message, "error");
    }
});


