import React from 'react';

const CountryInfo = ({ country, weather, toggleShow }) => {

  if (!country) {
    return null;
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        capital: {country.capital}
        <br />
        area: {country.area}
      </p>
      <p>
        <strong>languages:</strong>
      </p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      
      {weather ? (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: 
            {Math.round
            ((weather.main.temp - 273.15 + Number.EPSILON) * 10) / 10}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

export default CountryInfo;
