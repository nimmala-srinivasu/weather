import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import "./WeatherForecast.css";

const API_KEY = "1635890035cbba097fd5c26c8ea672a1";

const WeatherForecast = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  const getWeatherData = async () => {
    setLoading(true);

    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    try {
      const response = await axios.get(apiUrl);
      const filteredData = response.data.list.filter((reading, index, arr) => {
        const currentDate = new Date(reading.dt * 1000).getDate();
        const nextDate =
          index === arr.length - 1
            ? null
            : new Date(arr[index + 1].dt * 1000).getDate();
        return currentDate !== nextDate;
      });

      setForecastData(filteredData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetForecast = () => {
    getWeatherData();
  };

  return (
    <div className="weather-forecast">
      <h1>Weather in your city</h1>
      <div className="mainc">
        <div className="column">
          <input
            className="search-box"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <div className="column">
          <button className="forecast-button" onClick={handleGetForecast}>
            Get Forecast
          </button>
        </div>
        <div className="column">
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
      {forecastData.length > 0 && !loading && (
        <div>
          <div className="forecast-container">
            {forecastData.map((reading, index) => (
              <div key={index} className="forecast-card">
                <table className="table-class" border={1}>
                  <tr>
                    <th colSpan={2}>
                      <p className="date">
                        Date: {moment(reading.dt * 1000).format("DD/MM/YYYY")}
                      </p>
                    </th>
                  </tr>

                  <tr className="temp-color">
                    <td colSpan={2}>
                      <p className="date">Temprature</p>
                    </td>
                  </tr>

                  <tr className="temp-color">
                    <td>
                      <p>Min</p>
                    </td>
                    <td>
                      <p>Max</p>
                    </td>
                  </tr>

                  <tr className="temp-color">
                    <td>
                      <p>{kelvinToCelsius(reading.main.temp_min)}°C</p>
                    </td>
                    <td>
                      <p>{kelvinToCelsius(reading.main.temp_max)}°C</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Humidity</p>
                    </td>
                    <td>
                      <p>{reading.main.humidity}%</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Pressure</p>
                    </td>
                    <td>
                      <p>{reading.main.pressure} hPa</p>
                    </td>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
