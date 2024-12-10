import { useDispatch, useSelector } from 'react-redux'
import { increaseVote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      {anecdote.content}
      <br></br>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </li>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const sortedAnecdotes = anecdotes.sort((a,b) => b.votes - a.votes)

  return (
    <ul>
      {sortedAnecdotes.map(anecdote => 
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => 
            dispatch(increaseVote(anecdote.id))
          }
        />
      )}
    </ul>
  )
}

export default Anecdotes