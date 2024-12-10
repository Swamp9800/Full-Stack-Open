import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"

const NewAnecdote = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h3>Create new Anecdote</h3>
      <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submite">add</button>
    </form>
    </div>
   
  )
}

export default NewAnecdote