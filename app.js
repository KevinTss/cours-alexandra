let apiKey = "5779b9efe682cbd7772ff1fe36bcdf5f";
let units = "metric";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiEndpointForcast = "https://api.openweathermap.org/data/2.5/onecall";

function getIcon(iconId) {
  return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
}

function getDisplayDate() {
  let now = new Date();
  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = now.getFullYear();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  return `${day}  ${date} ${month} ${year} , ${hours}:${minutes}`;
}

function convertCelsiusToFahrenheit(inputCelsius) {
  // (5°C × 9/5) + 32 = 41°F
  const fahrenheit = inputCelsius * (9 / 5) + 32;

  return fahrenheit.toFixed();
}

function displayData(response) {
  let iconId = response.weather[0].icon;
  let tempC = response.main.temp;
  let tempF = convertCelsiusToFahrenheit(tempC);
  let humidity = response.main.humidity;
  let wind = response.wind.speed;
  let city = response.name;

  iconDisplay.innerHTML = `<img src="${getIcon(iconId)}" alt="icon"/>`;
  cityDisplay.innerText = city;
  tempDisplay.innerText = `${tempC}°C / ${tempF}°F`;
  windDisplay.innerText = `Wind speed: ${wind}`;
  humidityDisplay.innerText = `Humidity: ${humidity}`;
  timeDisplay.innerText = getDisplayDate();
}

function weekDay(index) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[index];
}

function weekDayDate(index) {
  let now = new Date();
  now.setDate(now.getDate() + index + 1);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let dayDate = now.getDate();
  return `${month} ${dayDate}`;
}

const form = document.getElementById("form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentLocationButton = document.querySelector("#current-location");
const iconDisplay = document.getElementById("icon");
const cityDisplay = document.getElementById("city");
const tempDisplay = document.getElementById("temp");
const timeDisplay = document.getElementById("time");
const windDisplay = document.getElementById("wind");
const humidityDisplay = document.getElementById("humidity");
const forecastContainer = document.getElementById("forcast-container");

currentLocationButton.addEventListener("click", function (e) {
  e.preventDefault();
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   let lat = position.coords.latitude;
  //   let lon = position.coords.longitude;

  //   // ...
  // });
  let lat = 50.8503;
  let lon = 4.3517;

  fetch(`${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
    .then((r) => r.json())
    .then(displayData)
    .then(() =>
      fetch(
        `${apiEndpointForcast}?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=${apiKey}&units=${units}`
      )
    )
    .then((r) => r.json())
    .then((res) => {
      let daysTemp = res.daily;
      let elements = "";

      daysTemp.slice(0, 5).forEach(function (dailyTemp, index) {
        let iconId = dailyTemp.weather[0].icon;
        let tempMin = dailyTemp.temp.min;
        let tempMax = dailyTemp.temp.max;

        let el = `
        <div class="col-sm">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${weekDay(index)}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${weekDayDate(
                index
              )}</h6>
              <p class="card-text">
                ${tempMin.toFixed()}°C - ${tempMax.toFixed()}°C
                <img src="${getIcon(iconId)}" alt="icon" class="icon-image"/>
              </p>
            </div>
          </div>
        </div>
        `;

        elements = elements + el;
        forecastContainer.innerHTML = elements;
      });
    });
});

searchButton.addEventListener("click", function (e) {
  e.preventDefault();

  let city = cityInput.value;

  fetch(`${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`)
    .then((r) => r.json())
    .then(displayData);
});
