import axios from 'axios'
const loginUrl = '/api/login'

const loginAppUser = async loginValues => {
  const response = await axios.post(loginUrl, loginValues)
  return response.data
}

const functions = { loginAppUser }
export default functions