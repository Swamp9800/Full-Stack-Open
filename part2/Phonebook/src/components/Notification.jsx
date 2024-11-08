import '../index.css'

const Notification = ({ message, bool }) => {
    if (message === null) {
      return null
    }
    
    if (bool){
        return (
            <div className='success'>
                {message}
            </div>
            )
    }
    return (
        <div className='error'>
            {message}
        </div>
    )
    
  }

export default Notification