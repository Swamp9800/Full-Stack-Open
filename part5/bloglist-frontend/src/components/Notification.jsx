import '../index.css'

const Notification = ({ message, bool }) => {
  if (message === null) {
    return null
  }

  const messageClass = bool ? 'success' : 'error'

  return (
    <div className={messageClass}>
      {message}
    </div>
  )
}

export default Notification