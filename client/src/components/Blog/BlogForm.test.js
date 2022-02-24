import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('Blog-form tests', () => {
  let component
  let createBlogHandler

  beforeEach(() => {
    createBlogHandler = jest.fn()

    component = render(
      <BlogForm
        createBlog={createBlogHandler}
      />
    )
  })

  test('Form would create blog with correct values', () => {
    const form = component.container.querySelector('form')

    const title = component.container.querySelector(
      '#blog-form-title'
    )
    const author = component.container.querySelector(
      '#blog-form-author'
    )
    const url = component.container.querySelector(
      '#blog-form-url'
    )
    const likes = component.container.querySelector(
      '#blog-form-likes'
    )

    fireEvent.change(title, {
      target: { value: 'TITLE' }
    })

    fireEvent.change(author, {
      target: { value: 'AUTHOR' }
    })

    fireEvent.change(url, {
      target: { value: 'VALID-URL' }
    })

    fireEvent.change(likes, {
      target: { value: '100' }
    })

    fireEvent.submit(form)

    expect( createBlogHandler.mock.calls ).toHaveLength(1)
    expect( createBlogHandler.mock.calls[0][0].title ).toBe( 'TITLE' )
    expect( createBlogHandler.mock.calls[0][0].author ).toBe( 'AUTHOR' )
    expect( createBlogHandler.mock.calls[0][0].url ).toBe( 'VALID-URL' )
    expect( createBlogHandler.mock.calls[0][0].likes ).toBe( '100' )

    expect( JSON.stringify(createBlogHandler.mock.calls[0][0]) )
      .toBe( JSON.stringify(
        { title: 'TITLE', author: 'AUTHOR', url: 'VALID-URL', likes: '100' }
      ))
  })
})