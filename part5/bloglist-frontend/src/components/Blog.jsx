import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    console.log(updatedBlog)
    addLike(updatedBlog)
  }

  const blogRemover = () => {
    removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {!detailsVisible ? (
        <div className='toggleOff'>
          {blog.title}
          <button onClick={toggleDetails}>View</button>
        </div>
      ) : (
        <div className='togglableContent'>
          {blog.title}
          <button onClick={toggleDetails}>Hide</button>
          <br></br>
          {blog.url}
          <br></br>
          <span className='likes'>{blog.likes}</span>
          <button onClick={handleLike}>Like</button>
          <br></br>
          {blog.author}
          <br></br>
          {currentUser && blog.user && blog.user.username === currentUser.username && (
            <button onClick={blogRemover}>Remove</button>
          )}
        </div>
      )}
    </div>
  )
}


export default Blog