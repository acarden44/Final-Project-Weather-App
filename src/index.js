let isMetric = false;
let currentTemperature = null;
let currentWindSpeed = null;

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
    temperatureElement.innerHTML = Math.round(currentTemperature);
    windSpeedElement.innerHTML = `${Math.round(currentWindSpeed)} mph`;
    unitElement.innerHTML = "°F";
    toggleButton.innerHTML = "Switch to °C";
  } else {
    temperatureElement.innerHTML = Math.round(
      (currentTemperature - 32) * (5 / 9)
    );
    windSpeedElement.innerHTML = `${Math.round(
      currentWindSpeed * 1.60934
    )} kph`;
    unitElement.innerHTML = "°C";
    toggleButton.innerHTML = "Switch to °F";
  }
  isMetric = !isMetric;
}

document
  .querySelector("#unit-toggle-button")
  .addEventListener("click", toggleUnits);

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(refreshWeather);
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
});

function displayForecast() {
  let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastHtml = "";

  days.forEach(function (day) {
    forecastHtml =
      forecastHtml +
      `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${day}</div>
        <div class="weather-forecast-icon">🌤️</div>
        <div class="weather-forecast-temps">
          <div class="weather-forecast-temp">
            <strong>15º</strong>
          </div>
          <div class="weather-forecast-temp">9º</div>
        </div>
      </div>
    `;
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

searchCity("Grand Rapids");
displayForecast();
