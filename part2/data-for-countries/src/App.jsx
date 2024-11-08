import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import CountryList from './components/CountryList';
import data from './services/data';
import axios from 'axios';

const api_key = import.meta.env.VITE_SOME_KEY;

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [toggleCountry, setToggle] = useState(null);  
  const [weather, setWeather] = useState("");

  useEffect(() => {
    data
      .getAll()
      .then(country => {
        console.log(country);
        setCountries(country);
      });
  }, []);

  const showWeather = (country) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`)
      .then(response => {
        console.log(response.data);
        setWeather(response.data);
      });
  };

  const toggleShow = (country) => {
    setToggle(country); 
    showWeather(country)
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term && countries.length > 0) {
      const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(term.toLowerCase())
      );

      if (filteredCountries.length === 1) {
        showWeather(filteredCountries[0]);
      } else if (filteredCountries.length === 0) {
        showWeather(null);
      }
    }
  };

  return (
    <div>
      debug: {searchTerm}
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <CountryList
        countries={countries}
        searchTerm={searchTerm}
        toggleShow={toggleShow}
        toggle={toggleCountry} 
        weather={weather}
      />
    </div>
  );
}

export default App;
