import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, getAppUser }) => {
  const [extension, setExtension] = useState(false)

  const changeExtension = () => {
    setExtension(!extension)
  }

  const addLike = (event) => {
    event.preventDefault()

    updateBlog({
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }, blog.id )
  }

  const removeBlog = () => {
    deleteBlog(blog.title, blog.id)
  }

  // DELETE-BUTTON USER-CHECK
  // This cannot solve added/modified blogs "correctly" due to differences in server-side returns:
  // blog.user: *ID*
  // blog.user: {username: *USERNAME*, name: *NAME*, id: *ID*}
  // not going back to part 4 now so let's assume that every blog in list that doesn't
  // define user field as an object has indeed been added by this user
  const blogBelongsToUser = () => {
    if(!blog.user.username){
      console.log('Blog belongs to this user or has been modified by current user (ownership assumed)')
      return true
    }

    const user = getAppUser()
    return user.username === blog.user.username
  }

  if(extension === true) {
    return (
      <div className="simple-container">
        <div>{blog.title}
          <button onClick={changeExtension}>Hide</button></div>
        <div>{blog.author}</div>
        <div>{blog.url}</div>
        <div>{blog.likes}
          {blog.likes && <button onClick={addLike}>Like</button>}</div>

        { blogBelongsToUser() &&
        <div>
          <button
            className="warning-button"
            onClick={() => {if(window.confirm(`Confirm removal of ${blog.title}?`)){removeBlog()}}}>Delete
          </button>
        </div>}
      </div>
    )
  }

  else {
    return (
      <div className="simple-container">
        {blog.title} {blog.author} <button onClick={changeExtension}>View</button>
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  getAppUser: PropTypes.func.isRequired,
}

export default Blog