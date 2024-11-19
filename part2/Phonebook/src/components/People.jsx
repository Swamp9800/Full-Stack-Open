import Person from "./Person";

const People = ({persons, searchTerm, toggleDelete}) => {
    const PersonsToShow = searchTerm
    ? persons.filter(person => 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : persons
    return (
      <div>
        {PersonsToShow.map(person =>
          <Person key={person.id} person={person} toggleDelete={() => toggleDelete(person._id, person.name)}/>
        )}
      </div>
    )
  }

export default People