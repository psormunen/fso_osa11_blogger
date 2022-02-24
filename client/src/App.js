import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog/Blog'
import BlogForm from './components/Blog/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const UserLoginForm = ({ handleAppLogin, appUsername, appPassword, setAppUsername, setAppPassword }) => (
  <form onSubmit={handleAppLogin}>
    <div>
      <span className="input-label">username:</span>
      <input id="username" type="text" value={appUsername} onChange={({ target }) => setAppUsername(target.value)} />
    </div>
    <div>
      <span className="input-label">password:</span>
      <input id="password" type="password" value={appPassword} onChange={({ target }) => setAppPassword(target.value)} />
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
)

const Blogs = ({ blogs, addBlog, blogFormRef, updateBlog, deleteBlog, getAppUser }) => (
  <div>
    <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
      <h3>Add new blog</h3>

      <BlogForm createBlog={addBlog}/>
    </Togglable>

    <h3>List of added blogs:</h3>

    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} getAppUser={getAppUser}/>
    )}
  </div>
)

const User = ({ user, handleAppLogout }) => (
  <>
    --
    <span style={{ color: '#3ea964' }}> Logged in as {user.username}
      <button
        onClick={() => {if(window.confirm(`Confirm logout as ${user.username}?`)){handleAppLogout()}}}
      >Logout</button>
    </span>
  </>
)

const Alert = ({ message, messageType }) => {
  if(message === null || message === ''){
    return null
  }

  return (
    <>
      <div className={`alert ${messageType}`}>
        {message}
      </div>
    </>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [appUsername, setAppUsername] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [appUser, setAppUser] = useState(null)
  const [alert, setAlert] = useState({ message: '', messageType: '' })
  const blogFormRef = useRef()

  useEffect(() => {
    const userLoggedIn = window.localStorage.getItem('appUser')

    if (userLoggedIn) {
      const user = JSON.parse(userLoggedIn)
      setAppUser(user)

      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setSortedBlogs( blogs )
      )
    }
  }, [])

  const setSortedBlogs = (blogs) => {
    setBlogs([...blogs].sort((a,b) =>  a.likes - b.likes).reverse())
  }

  const setAlertMessage = (message, messageType) => {
    setAlert({ message, messageType })
    setTimeout(() => {
      setAlert({ ...alert, message: null })
    }, 5000)
  }

  const handleAppLogin = async (event) => {
    event.preventDefault()
    console.log('Trying to login with following parameters', appUsername, appPassword)

    try {
      const user = await loginService.loginAppUser({
        username: appUsername,
        password: appPassword })

      blogService.setToken(user.token)
      window.localStorage.setItem('appUser', JSON.stringify(user))
      setAppUser(user)
      setAppUsername('')
      setAppPassword('')
      setAlertMessage('Login was successful', 'success')

      const blogs = await blogService.getAll()
      setSortedBlogs( blogs )

    } catch (exception) {
      setAlertMessage('Could not login with given credentials', 'warning')
    }
  }

  const handleAppLogout = () => {
    window.localStorage.removeItem('appUser')
    setAppUser(null)
  }

  const addBlog = (blog) => {
    blogService
      .createBlog(blog)
      .then(returnedBlog => {
        setSortedBlogs(blogs.concat(returnedBlog))
      })
      .then(() => {
        setAlertMessage(`Added new blog ${blog.title}`, 'success')
        blogFormRef.current.changeVisibility()
      })
      .catch(error => setAlertMessage(`${error.response.data.error}`, 'warning'))
  }

  const updateBlog = (blog, blogId) => {
    blogService
      .updateBlog(blog, blogId)
      .then(updatedBlog => {
        setSortedBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
      })
      .then(() => {
        setAlertMessage(`Updated blog ${blog.title}`, 'success')
      })
      .catch(error => setAlertMessage(`${error.response.data.error}`, 'warning'))
  }

  const deleteBlog = (blogTitle, blogId) => {
    blogService
      .deleteBlog(blogId)
      .then(() => {
        setSortedBlogs(blogs.filter(blog => blog.id !== blogId))
      })
      .then(() => setAlertMessage(`Deleted blog ${blogTitle}`, 'success'))
      .catch(() => {
        setAlertMessage(`Blog ${blogTitle} was already deleted`, 'warning')
        blogService.getAll().then(blogs =>
          setSortedBlogs( blogs )
        )
      })
  }

  const getAppUser = () => {
    return appUser
  }

  return (
    <div>
      <Alert message={alert.message} messageType={alert.messageType}/>

      <h2>My favourite blogs {appUser === null ?
        '' :
        <User
          user={appUser}
          handleAppLogout={handleAppLogout}
        />}
      </h2>

      {appUser === null ?
        <UserLoginForm
          handleAppLogin={handleAppLogin}
          appUsername={appUsername}
          appPassword={appPassword}
          setAppUsername={setAppUsername}
          setAppPassword={setAppPassword}
        /> :
        <Blogs
          blogs={blogs}
          addBlog={addBlog}
          blogFormRef={blogFormRef}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          getAppUser={getAppUser}
        />
      }
    </div>
  )
}

export default App