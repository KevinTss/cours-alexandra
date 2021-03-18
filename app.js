let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  moscow: {
    temp: -5,
    humidity: 20,
  },
};
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const convertCelsiusToFahrenheit = function (inputCelsius) {
  // (5°C × 9/5) + 32 = 41°F
  const fahrenheit = inputCelsius * (9 / 5) + 32;

  return fahrenheit;
};

const getTime = function () {
  let time = new Date();
  let day = days[time.getDay()];
  let hour = time.getHours();
  let min = time.getMinutes();

  // Monday - 12:45
  return `${day} - ${hour}:${min}`;
};

const form = document.getElementById("form");
const cityInput = document.querySelector("#city-input");
const cityDisplay = document.getElementById("city");
const tempDisplay = document.getElementById("temp");
const timeDisplay = document.getElementById("time");

timeDisplay.innerText = getTime();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let city = cityInput.value;
  city = city.toLowerCase();
  city = city.trim();

  if (weather[city] !== undefined) {
    const tempCelsius = Math.round(weather[city].temp);
    const tempF = convertCelsiusToFahrenheit(tempCelsius);
    const tempContent = `${tempCelsius}°C / ${tempF}°F`;

    cityDisplay.innerText = city;
    tempDisplay.innerText = tempContent;
  } else {
    console.log("erreur");
  }
});
