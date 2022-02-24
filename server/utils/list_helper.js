let _ = require('lodash')

const dummy = (/*blogs*/) => {
  // no data yet
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes , 0)
  return total
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]

  blogs.forEach((blog) => {
    if(blog.likes > favorite.likes) favorite = blog
  })

  return favorite
}

const mostBlogs = (blogs) => {
  let bloggers = []

  blogs.forEach((blog) => {
    if(bloggers[blog.author] === undefined) {
      bloggers[blog.author] = { author: blog.author, blogs: 1 }
    }
    else {
      bloggers[blog.author] = {
        ...bloggers[blog.author],
        blogs: bloggers[blog.author].blogs + 1 }
    }
  })

  return Object.values(bloggers).reduce((previous, current) => {
    return (previous.blogs > current.blogs) ? previous : current
  })
}

const mostLikes = (blogs) => {
  const authorBlogs = _(blogs).groupBy('author').values().map(
    (group) => {
      let likes = 0

      group.forEach(authorBlog => {
        likes += authorBlog.likes
      })

      return { author: group[0].author, likes: likes }
    }
  )

  return _.maxBy(authorBlogs.value(), 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}