const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '61939afcb269c22bea752351',
    title: 'Howto create node backend',
    author: 'Neil Ranger',
    url: '/blog/this/is/way/of/the/code',
    likes: 300,
    __v: 0
  },
  {
    _id: '61939b6fb269c22bea752354',
    title: 'Life of calmness - masters of Zen',
    author: 'Astrid Tailor',
    url: '/zen/blog/hello',
    likes: 120000000,
    __v: 0
  },
  {
    _id: '61939b72b269c22bea752356',
    title: 'The way of Owl',
    author: 'Heidi the blogger',
    url: '/lifestyle/art/me',
    likes: 100,
    __v: 0
  },
  {
    _id: '619392f70c58627ea4cb6201',
    title: 'Do I believe in imaginary numbers',
    author: 'Neil Ranger',
    url: '/blog/systems-of-stuctures-and-everything/4001',
    likes: 700,
    __v: 0
  },
]

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list should be zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('with only one blog post total is likes of that', () => {
    expect(listHelper.totalLikes( [blogs[0]] )).toBe(300)
  })

  test('of multiple blog posts total is the amount of likes they have', () => {
    const selection = [ blogs[0], blogs[1] ]

    expect(listHelper.totalLikes(selection)).toBe(120000300)
  })
})

describe('Blog objects', () => {
  test('Blog with highest amount of likes', () => {
    expect(listHelper.favoriteBlog( blogs )).toEqual( blogs[1] )
  })
})

describe('Custom blog objects', () => {
  const result = {
    author: 'Neil Ranger',
    blogs: 2
  }

  test('Author with most blog posts and their total number', () => {
    expect(listHelper.mostBlogs( blogs )).toEqual( result )
  })
})

describe('Lodash test', () => {
  const result = {
    author: 'Astrid Tailor',
    likes: 120000000
  }

  test('Author with most likes and their total number', () => {
    expect(listHelper.mostLikes( blogs )).toEqual( result )
  })
})