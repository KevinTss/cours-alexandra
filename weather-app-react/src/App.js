import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
const apiEndpointForcast = 'https://api.openweathermap.org/data/2.5/onecall';
const apiKey = '5779b9efe682cbd7772ff1fe36bcdf5f';
const units = 'metric';

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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[now.getDay()];
  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let month = months[now.getMonth()];
  return `${day}  ${date} ${month} ${year} , ${hours}:${minutes}`;
}

function getIcon(iconId) {
  return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
}

function tempFar(temp) {
  return (temp * (9 / 5) + 32).toFixed();
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [temp, setTemp] = useState(null);
  const [city, setCity] = useState(null);
  const [wind, setWind] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [iconId, setIconId] = useState(null);
  const [forecasts, setForecasts] = useState([]);

  const getWeather = () => {
    axios
      .get(
        `${apiEndpoint}?q=${
          inputValue || 'Paris'
        }&appid=${apiKey}&units=${units}`
      )
      .then((res) => {
        setTemp(Math.round(res.data.main.temp));
        setCity(res.data.name);
        setWind(res.data.wind.speed);
        setHumidity(res.data.main.humidity);
        setIconId(res.data.weather[0].icon);
        return res;
      })
      .then((previousRes) =>
        axios.get(
          `${apiEndpointForcast}?lat=${previousRes.data.coord.lat}&lon=${previousRes.data.coord.lon}&exclude=current,hourly,minutely,alerts&appid=${apiKey}&units=${units}`
        )
      )
      .then((res) => {
        setForecasts(
          res.data.daily
            .map((data) => ({
              humidity: data.humidity,
              temp: Math.round(data.temp.day),
              iconId: data.weather[0].icon,
              wind: data.wind_speed,
            }))
            .slice(0, 5)
        );
      });
  };

  useEffect(() => {
    getWeather();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  console.log('forecasts', forecasts);

  return (
    <div className='App'>
      <div className='top'>
        <form onSubmit={onSubmit} className='form-search'>
          <div>{getDisplayDate()}</div>
          <div className='fields'>
            <input
              type='text'
              placeholder='city'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button>Search</button>
          </div>
        </form>
        {temp ? (
          <div className='current-temperature'>
            <p id='city'>{city}</p>
            <div>
              <div id='icon'>
                {iconId ? <img src={getIcon(iconId)} alt='icon' /> : null}
              </div>
              <span>
                {temp}°C / {tempFar(temp)}°F
              </span>
              <span className='small'>Wind: {wind}</span>
              <span className='small'>Humidity: {humidity}</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className='bottom'>
        {forecasts.map((forecast) => (
          <div key={JSON.stringify(forecast)} className='forecast-card'>
            <img src={getIcon(forecast.iconId)} alt='icon' />
            <span>
              {forecast.temp}°C / {tempFar(forecast.temp)}°F
            </span>
            <span className='small'>Wind: {forecast.wind}</span>
            <span className='small'>Humidity: {forecast.humidity}</span>
          </div>
        ))}
      </div>
      <footer>footer ici...</footer>
    </div>
  );
}

export default App;

// Date
// Forecast 5 jours
