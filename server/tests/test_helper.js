const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const helperBlogs = [
  {
    title: 'Howto create node backend',
    author: 'Neil Ranger',
    url: '/blog/this/is/way/of/the/code',
    likes: 300,
  },
  {
    title: 'Life of calmness - masters of Zen',
    author: 'Astrid Tailor',
    url: '/zen/blog/hello',
    likes: 120000000,
  },
  {
    title: 'The way of Owl',
    author: 'Heidi the blogger',
    url: '/lifestyle/art/me',
    likes: 100,
  },
  {
    title: 'Do I believe in imaginary numbers',
    author: 'Neil Ranger',
    url: '/blog/systems-of-stuctures-and-everything/4001',
    likes: 700,
  },
]

const getBlogsFromDB = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const getUsersFromDB = async () => {
  const users = await User.find({})
  return users
}

const returnUserToken = async (userName) => {
  const user = await User.findOne({ username: userName })

  const tokenUser = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(tokenUser, process.env.SECRET)
}

module.exports = { helperBlogs, getBlogsFromDB, getUsersFromDB, returnUserToken }