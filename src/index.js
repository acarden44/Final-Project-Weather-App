let isMetric = false;
let currentTemperature = null;
let currentWindSpeed = null;
let forecastData = []; // Store forecast data to update when toggling units

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity-level");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let date = new Date(response.data.time * 1000);
  currentTemperature = response.data.temperature.current;
  currentWindSpeed = response.data.wind.speed;

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  temperatureElement.innerHTML = Math.round(currentTemperature);
  windSpeedElement.innerHTML = `${Math.round(currentWindSpeed)} mph`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function toggleUnits() {
  let temperatureElement = document.querySelector("#temperature");
  let windSpeedElement = document.querySelector("#wind-speed");
  let unitElement = document.querySelector("#unit");
  let toggleButton = document.querySelector("#unit-toggle-button");

  if (isMetric) {
    // Convert back to Fahrenheit
    temperatureElement.innerHTML = Math.round(currentTemperature);
    windSpeedElement.innerHTML = `${Math.round(currentWindSpeed)} mph`;
    unitElement.innerHTML = "°F";
    toggleButton.innerHTML = "Switch to °C";
    updateForecastTemps(false);
  } else {
    // Convert to Celsius
    temperatureElement.innerHTML = Math.round(
      (currentTemperature - 32) * (5 / 9)
    );
    windSpeedElement.innerHTML = `${Math.round(
      currentWindSpeed * 1.60934
    )} kph`;
    unitElement.innerHTML = "°C";
    toggleButton.innerHTML = "Switch to °F";
    updateForecastTemps(true);
  }

  isMetric = !isMetric;
}

document
  .querySelector("#unit-toggle-button")
  .addEventListener("click", toggleUnits);

function searchCity(city) {
  let apiKey = "3b34c40446ftcf4f07e329o00aa2e010";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "3b34c40446ftcf4f07e329o00aa2e010";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  forecastData = response.data.daily; // Store forecast data
  updateForecastTemps(isMetric);
}

function updateForecastTemps(toMetric) {
  let forecastHtml = "";

  forecastData.forEach(function (day, index) {
    if (index < 5) {
      let maxTemp = toMetric
        ? Math.round((day.temperature.maximum - 32) * (5 / 9))
        : Math.round(day.temperature.maximum);
      let minTemp = toMetric
        ? Math.round((day.temperature.minimum - 32) * (5 / 9))
        : Math.round(day.temperature.minimum);

      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="icon" />
          <div class="weather-forecast-temps">
            <div class="weather-forecast-temp"><strong>${maxTemp}º</strong></div>
            <div class="weather-forecast-temperature">${minTemp}º</div>
          </div>
        </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Grand Rapids");
