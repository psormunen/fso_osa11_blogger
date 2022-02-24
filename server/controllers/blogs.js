const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  const user = req.user

  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if(blog === null) return res.status(404).json({ error: 'Blog does not exist' })

  const user = req.user
  if( !(blog.user.toString() === user.id) ) return res.status(401).json({ error: 'Blog does not belong to token user' })

  const returnValue = await blog.remove()
  returnValue ? res.status(204).end() : res.status(404).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = req.body

  const updateBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }

  const returnValue = await Blog
    .findByIdAndUpdate(req.params.id, updateBlog, { new: true })

  returnValue ? res.json(returnValue) : res.status(404).end()
})

blogsRouter.get('/:id', async (req, res) => {
  const returnValue = await Blog.findById(req.params.id)
  returnValue ? res.json(returnValue) : res.status(404).end()
})

module.exports = blogsRouter