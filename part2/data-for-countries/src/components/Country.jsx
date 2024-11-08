const Country = ({ country, toggleshow }) => {
    const handleClick = () => {
      toggleshow(country);
    }
  
    return (
      <div>
        {country.name.common}
        <button onClick={handleClick}>Show Details</button>
      </div>
    );
  }

export default Country