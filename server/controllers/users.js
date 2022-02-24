const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const returnValue = await User.findById(req.params.id)
  returnValue ? res.json(returnValue) : res.status(404).end()
})

usersRouter.post('/', async (req, res) => {
  const user = req.body

  if (user.password === undefined || user.password === '') {
    return res.status(400).json({ error: 'Password required' })
  }
  if (user.password.length < 3) {
    return res.status(400).json({ error: 'Password must contain at least 3 characters' })
  }

  const difficulty = 10
  const passwordHash = await bcrypt.hash(user.password, difficulty)

  const userToSave = new User({
    username: user.username,
    name: user.name,
    passwordHash,
  })

  const savedUser = await userToSave.save()
  res.json(savedUser)
})

module.exports = usersRouter