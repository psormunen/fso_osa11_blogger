const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('BNhj234234--1', 10)
  const userToSave = new User({
    username: 'vertigo',
    name: 'Heidi Pilvi',
    passwordHash })
  const user = await userToSave.save()

  for(let key in testHelper.helperBlogs){
    const blog = new Blog( testHelper.helperBlogs[key] )

    blog.user = user._id
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  }
})

/** READ */
describe('testing returns from database', () => {
  test('database returns correct amount of blogs', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const res = await api.get('/api/blogs').set({ Authorization: 'bearer ' + token })
    expect(res.body).toHaveLength( testHelper.helperBlogs.length )
  })

  test('Blog has correct id-field', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const res = await api.get('/api/blogs').set({ Authorization: 'bearer ' + token })
    expect(res.body[0].id).toBeDefined()
  })

  test('getting specific blog from database', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogs = await api.get('/api/blogs').set({ Authorization: 'bearer ' + token })
    let selectedBlog = blogs.body[0]

    await api
      .get(`/api/blogs/${selectedBlog.id}`)
      .set({ Authorization: 'bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

/** CREATE */
describe('testing inserts to database', () => {
  test('Blogs can be added to database', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogToAdd = {
      title: 'How to meditate like a pro',
      author: 'Astrid Tailor',
      url: '/zen/blog/meditation',
      likes: 1250000000,
    }

    await api
      .post('/api/blogs').send(blogToAdd)
      .set({ Authorization: 'bearer ' + token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs').set({ Authorization: 'bearer ' + token })

    const titles = blogs.body.map(blog => blog.title)
    const match = titles.filter(title => title === 'How to meditate like a pro')

    expect( titles ).toHaveLength( testHelper.helperBlogs.length + 1 )
    expect( match[0] ).toBeTruthy()
  })

  test('Likes defaults to 0 if value is not given', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogToAdd = {
      title: 'How to achieve wisdom of an eagle',
      author: 'Astrid Tailor',
      url: '/zen/blog/enlist_now',
    }

    const res = await api
      .post('/api/blogs').send(blogToAdd)
      .set({ Authorization: 'bearer ' + token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect( res.body.likes) .toBeDefined()
    expect( res.body.likes ).toBe( 0 )
  })

  test('If title and url is missing we get status 400', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogToAdd = {
      author: 'Astrid Tailor',
      likes: 1,
    }

    await api
      .post('/api/blogs').send(blogToAdd)
      .set({ Authorization: 'bearer ' + token })
      .expect(400)

    const blogsInDB = await testHelper.getBlogsFromDB()
    expect( blogsInDB.length ).toBe( testHelper.helperBlogs.length )
  })

  test('Blogs reference to user and vice versa', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogToAdd = {
      title: 'How to meditate like a pro - part 2',
      author: 'Astrid Tailor',
      url: '/zen/blog/meditation',
      likes: 1,
    }

    await api
      .post('/api/blogs').send(blogToAdd)
      .set({ Authorization: 'bearer ' + token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDB = await testHelper.getBlogsFromDB()
    const match = blogsInDB.filter(blog => blog.title === 'How to meditate like a pro - part 2')

    expect( match[0].title ).toBeTruthy()

    const response = await api
      .get(`/api/users/${match[0].user}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = response.body
    expect( user.blogs ).toContain( match[0].id )
  })
})

/** DELETE */
describe('deleting from database', () => {
  test('Deleting blog', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogs = await api
      .get('/api/blogs')
      .set({ Authorization: 'bearer ' + token })
    const amountBeforeDeletion = blogs.body.length

    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set({ Authorization: 'bearer ' + token })
      .expect(204)

    const currentBlogs = await api
      .get('/api/blogs')
      .set({ Authorization: 'bearer ' + token })
    const amountAfterDeletion = currentBlogs.body.length

    expect( amountAfterDeletion ).toBe( amountBeforeDeletion - 1 )
  })

  test('Cannot delete blog with malformatted id', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    await api
      .delete('/api/blogs/1')
      .set({ Authorization: 'bearer ' + token })
      .expect(400)

    const blogsInDB = await testHelper.getBlogsFromDB()
    expect( blogsInDB.length ).toBe( testHelper.helperBlogs.length )
  })

  test('Cannot delete blog with nonexisting id', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    await api
      .delete('/api/blogs/618e574da1846416295b25e2')
      .set({ Authorization: 'bearer ' + token })
      .expect(404)

    const blogsInDB = await testHelper.getBlogsFromDB()
    expect( blogsInDB.length ).toBe( testHelper.helperBlogs.length )
  })
})

/** UPDATE */
describe('modifying database values', () => {
  test('modifying blog', async () => {
    const token = await testHelper.returnUserToken('vertigo')

    const blogs = await api
      .get('/api/blogs')
      .set({ Authorization: 'bearer ' + token })
    let selectedBlog = blogs.body[0]
    const newTitle = 'new title'
    const newUrl = 'new url'

    selectedBlog = {
      ...selectedBlog,
      title: newTitle,
      url: newUrl
    }

    const res = await api
      .put(`/api/blogs/${selectedBlog.id}`).send(selectedBlog)
      .set({ Authorization: 'bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const modifiedBlog = res.body

    expect( modifiedBlog.title ).toBe( newTitle )
    expect( modifiedBlog.url ).toBe( newUrl )
  })
})

afterAll(() => mongoose.connection.close())