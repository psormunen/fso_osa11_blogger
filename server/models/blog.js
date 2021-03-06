const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, blogObject) => {
    blogObject.id = blogObject._id.toString()
    delete blogObject._id
    delete blogObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog