import React,{ useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: '' })

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes
    })

    setNewBlog({ title: '', author: '', url: '', likes: '' })
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <span className="input-label">title:</span>
        <input value={newBlog.title} id="blog-form-title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} />
      </div>
      <div>
        <span className="input-label">author:</span>
        <input value={newBlog.author} id="blog-form-author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} />
      </div>
      <div>
        <span className="input-label">url:</span>
        <input value={newBlog.url} id="blog-form-url"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} />
      </div>
      <div>
        <span className="input-label">likes:</span>
        <input value={newBlog.likes} id="blog-form-likes"
          onChange={({ target }) => setNewBlog({ ...newBlog, likes: target.value })} />
      </div>
      <div>
        <button type="submit">Add blog</button>
      </div>
    </form>
  )
}

export default BlogForm