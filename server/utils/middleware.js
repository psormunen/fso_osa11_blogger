const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method} -- Path: ${req.path}`)
  logger.info('Body: ', req.body, '\n----------------------------------------')

  next()
}

const unknownRoute = (req, res) => {
  res.status(404).send({ error: 'This route doesn\'t exist' })
}

const errorHandler = (error, req, res, next) => {
  logger.info(`Error transferred to errorHandler: ${error.message}`)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Id was not correctly formatted' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token was not valid' })
  }

  logger.info('...errorHandler passed this error onwards...')
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    req.token = token
    logger.info('Token was received...')
  }
  else {
    req.token = null
  }

  next()
}

const userExtractor = async (req, res, next) => {
  const token = req.token
  if(!token) return res.status(401).json({ error: 'Token not set' })

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: 'Token is invalid' })

  const user = await User.findById( decodedToken.id )
  if (user === null) return res.status(404).json({ error: 'User does not exist' })

  req.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownRoute,
  errorHandler,
  tokenExtractor,
  userExtractor
}