import React, { useState, useEffect } from "react";
import "./WeatherForm.css";
import YaMapsLocation from "./YaMapsLocation";

const API_KEY = "18b3a9d4b3dbc824f86f95495cccb313";

function WeatherForm() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [selectedCityCoords, setSelectedCityCoords] = useState(null);
  const [currentWeatherData, setCurrentWeatherData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );
    
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok || !currentWeatherResponse.ok) {
      setWeatherData(null);
      setCurrentWeatherData(null);
      return;
    }
    
    const forecastData = await forecastResponse.json();
    setWeatherData(forecastData);
  
    const currentWeatherData = await currentWeatherResponse.json();
    setCurrentWeatherData(currentWeatherData);
  
    // Get the coordinates of the selected city
    if (forecastData.cod === "200") {
      const cityCoords = {
        lat: forecastData.city.coord.lat,
        lon: forecastData.city.coord.lon
      };
      setSelectedCityCoords(cityCoords);
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
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

  const forecast = weatherData
  ? weatherData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
      const day = days[date.getDay()];
      const temperature = Math.round(item.main.temp - 273.15);
      const description = item.weather[0].description;

      // Проверяем, есть ли уже прогноз для этого дня
      const existingDayForecast = acc.find((forecast) => forecast.day === day);
      if (!existingDayForecast) {
        acc.push({ date, day, temperature, description });
      }

      return acc;
    }, [])
    .slice(1, 6)
  : [];

  return (
    <div>
      <h3 className="header">Weather Forecast</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="search-container"
          type="text"
          placeholder="Enter the name of the city/town..."
          value={city}
          onChange={handleCityChange}
        />
        <button className="search-button" type="submit">
          Найти
        </button>
      </form>

      {currentWeatherData && (
        <div>
          <h4>Current Weather in {city}</h4>
          <p>Temperature: {Math.round(currentWeatherData.main.temp - 273.15)}°C</p>
          <p>Description: {currentWeatherData.weather[0].description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <>
          <p>Weather forecast for the next five days in: <b>{city}</b></p>
          <div className="card-container">
            {forecast.map((item, index) => (
              <div className="card" key={index}>
                <h3><u>{item.day}</u></h3>
                <p>{item.date.toLocaleDateString()}</p>
                <p>Temperature: {item.temperature} °C</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          {selectedCityCoords && <YaMapsLocation coords={[selectedCityCoords.lat, selectedCityCoords.lon]} />}
        </>
      )}

      {weatherData === null && <p>Select a city to see the weather forecast.</p>}
    </div>
  );
}

export default WeatherForm;