import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog tests', () => {
  let component
  let updateHandler, deleteHandler, getAppUserHandler

  const blog = {
    user: 1,
    title: 'Title',
    author: 'Tester',
    url: 'blog/test',
    likes: 100
  }

  beforeEach(() => {
    updateHandler = deleteHandler = getAppUserHandler = jest.fn()

    component = render(
      <Blog
        blog={blog}
        updateBlog={ updateHandler }
        deleteBlog={ deleteHandler }
        getAppUser={ getAppUserHandler }
      />
    )
  })

  test('At first only author and title are visible', () => {
    expect(component.container).toHaveTextContent(
      'Title'
    )
    expect(component.container).toHaveTextContent(
      'Tester'
    )
    expect(component.container).not.toHaveTextContent(
      'blog/test'
    )
    expect(component.container).not.toHaveTextContent(
      '100'
    )
  })

  test('If we expand blog-container every field is set', () => {
    const button = component.getByText('View')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'Title'
    )
    expect(component.container).toHaveTextContent(
      'Tester'
    )
    expect(component.container).toHaveTextContent(
      'blog/test'
    )
    expect(component.container).toHaveTextContent(
      '100'
    )
  })

  test('If we click like-button twice we can verify these method calls', () => {
    const viewButton = component.getByText('View')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect( updateHandler.mock.calls ).toHaveLength(2)
  })
})