const PersonForm = (props) => {
    return (
      <form onSubmit={props.addName}>
          <label>
            name: <input 
              value={props.newName}
              onChange={props.handleNameChange}
            />
          </label>
          <br></br>
          <label>
            number: <input
              value={props.newNumber}
              onChange={props.handleNumberChange}
            />
          </label>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    )
  }

export default PersonForm