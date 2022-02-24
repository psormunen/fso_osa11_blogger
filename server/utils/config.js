require('dotenv').config()

let MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

let PORT = process.env.PORT || 3003

module.exports = { MONGODB_URI, PORT }