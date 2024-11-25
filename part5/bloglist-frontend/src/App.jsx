import { useState, useEffect, useRef } from 'react'
import './index.css'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [success, setSuccess] = useState(false)

  const blogFormRef = useRef()

  // State for the form inputs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (noteObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(noteObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccess(true)
        setErrorMessage(`Blog "${returnedBlog.title}" by "${returnedBlog.author}" added successfully`)
      })
      .catch(error => {
        setSuccess(false)
        setErrorMessage(`Error ${error.message}` || 'An error occured while adding the blog')
      })
  }

  const handleLikes = (noteObject) => {
    blogService
      .update(noteObject.id, noteObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog =>
          blog.id !== returnedBlog.id ? blog : returnedBlog
        ))
        setSuccess(true)
        setErrorMessage('Blog successfully liked')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setSuccess(false)
        setErrorMessage(`Error ${error.message}` || 'an error occured')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setSuccess(true)
          setErrorMessage(`${blog.title} successfully deleted`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setSuccess(false)
          setErrorMessage(`Error ${error.message}` || 'an error occured')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleLogin = async (noteObject) => {
    try {
      const { username, password } = noteObject
      const user = await loginService.login({
        username, password
      })
      console.log(user.token)

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log(exception)
      setSuccess(false)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.removeItem('loggedBlogAppUser')
    } catch (exception){
      console.log(exception)
      setSuccess(false)
      setErrorMessage('Something went wrong')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <div>
        <h1>Bloglist App</h1>

        <Notification message={errorMessage} bool={success}/>

        {user === null
          ?
          <div>
            <h2>Log in to application</h2>
            <div>
              <LoginForm
                login={handleLogin}
              />
            </div>
          </div>
          :
          <div>
            <h2>Blogs</h2>
            <h4>{user.name} logged-in
              <button onClick={handleLogout}>
                Logout
              </button>
            </h4>
            <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
              <BlogForm
                createBlog={addBlog}
              />
            </Togglable>
            <br></br>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
              <Blog 
                key={blog.id} 
                blog={blog} 
                addLike={handleLikes} 
                removeBlog={removeBlog}
                currentUser={user}
                />
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default App