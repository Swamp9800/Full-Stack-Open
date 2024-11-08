import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import People from './components/People'
import Filter from './components/Filter'
import phonebook from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")  
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [succeed, setSucceed] = useState(false)

  useEffect(() => {
    phonebook
      .getAll('http://localhost:3001/persons')
      .then(people => {
        console.log(people);
        setPersons(people)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target);
    if (persons.some(person => person.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName)
      
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber,
          id: existingPerson.id
        }
        phonebook
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name === personObject.name ? returnedPerson : person))
            setSucceed(true)
            setErrorMessage(
              `Changed number of ${person.name}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
          })
          .catch(error => {
            setSucceed(false)
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
          })
      }
    }
    else {  const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1
      }
      phonebook
        .create(nameObject)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName("")
          setNewNumber("")
          setSucceed(true)
          setErrorMessage(
            `Added ${person.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const toggleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      phonebook
        .delPerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error("Error deleting person:", error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} bool={succeed}/>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h3>Add a new</h3>
      <PersonForm 
      newName={newName} 
      newNumber={newNumber}
      addName={addName} 
      handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <People persons={persons} searchTerm={searchTerm} toggleDelete={toggleDelete}/>
    </div>
  )
}

export default App