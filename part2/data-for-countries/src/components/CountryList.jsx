// CountryList.js
import React from 'react';
import Country from './Country';
import CountryInfo from './CountryInfo';

const CountryList = 
({ countries, searchTerm, toggleShow, toggle, weather, }) => {
  const countriesToShow = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      {countriesToShow.length === 1  && (
        <div>
          <CountryInfo country={countriesToShow[0]} weather={weather} toggleshow={() => toggleShow(countriesToShow[0])}/>
        </div>
      )}
      {countriesToShow.length > 1 && countriesToShow.length < 10 && (
        <div>
          {countriesToShow.map(country => (
            <Country
              key={country.name.common} 
              country={country} 
              toggleshow={() => toggleShow(country)} 
            />
          ))}
          <CountryInfo country={toggle} weather={weather} />
        </div>
      )}
      {countriesToShow.length >= 10 && (
        <p>Too many countries to display, refine your search.</p>
      )}
    </div>
  );
}

export default CountryList;
