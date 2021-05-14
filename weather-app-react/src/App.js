import { useState } from 'react';
import './App.css';
import axios from 'axios';

const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '5779b9efe682cbd7772ff1fe36bcdf5f';
const units = 'metric';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [temp, setTemp] = useState(null);
  const [city, setCity] = useState(null);

  const tempFar = (temp * (9 / 5) + 32).toFixed();

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`${apiEndpoint}?q=${inputValue}&appid=${apiKey}&units=${units}`)
      .then((res) => {
        console.log('res', res);
        setTemp(Math.round(res.data.main.temp));
        setCity(res.data.name);
      });
  };

  return (
    <div className='App'>
      <div className='top'>
        <form onSubmit={onSubmit} className='form-search'>
          <input
            type='text'
            placeholder='city'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button>Search</button>
        </form>
        <div className='current-temperature'>
          <p id='city'>{city}</p>
          <div>
            <div id='icon'>
              <i className='fas fa-cloud-sun-rain fa-3x'></i>
            </div>
            <span id='temp'>
              {temp}°C / {tempFar}°F
            </span>
            <span id='time' className='small'></span>
            <span id='wind' className='small'></span>
            <span id='humidity' className='small'></span>
          </div>
        </div>
      </div>
      <div className='bottom'></div>
    </div>
  );
}

export default App;
