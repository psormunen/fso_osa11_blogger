import axios from 'axios'
const baseUrl = '/api/blogs'

let config = { headers: null }

const setToken = appToken => {
  config = { headers: { Authorization: ` bearer ${appToken}` } }
}

const getAll = () => {
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const createBlog = newBlog => {
  const request = axios.post(baseUrl, newBlog, config)
  return request.then(response => response.data)
}

const updateBlog = (modifiedBlog, blogId) => {
  const request = axios.put(`${baseUrl}/${blogId}`, modifiedBlog, config)
  return request.then(response => response.data)
}

const deleteBlog = (blogId) => {
  const request = axios.delete(`${baseUrl}/${blogId}`, config)
  return request.then(response => response.data)
}

const functions = { getAll, setToken, createBlog, updateBlog, deleteBlog }

export default functions