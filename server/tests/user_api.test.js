const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('BNhj234234--1', 10)
  const userToSave = new User({
    username: 'vertigo',
    name: 'Heidi Pilvi',
    passwordHash })

  await userToSave.save()
})

/** CREATE */
describe('testing inserts to database', () => {
  test('Empty username will not be accepted', async () => {
    const userToAdd = {
      username: '',
      name: 'Leonid Mattson',
      password: 'pass-123' }

    const res = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const message = JSON.parse(res.text)
    expect( message.error ).toMatch( /Username required/ )

    const usersInDB = await testHelper.getUsersFromDB()
    expect( usersInDB.length ).toBe( 1 )
  })

  test('Username less than 3 characters is no good here', async () => {
    const userToAdd = {
      username: 'le',
      name: 'Leonid Mattson',
      password: 'pass-123' }

    const res = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const message = JSON.parse(res.text)
    expect( message.error ).toMatch( /Username must contain at least 3 characters/ )

    const usersInDB = await testHelper.getUsersFromDB()
    expect( usersInDB.length ).toBe( 1 )
  })

  test('Empty password will not be accepted', async () => {
    const userToAdd = {
      username: 'leonidas',
      name: 'Leonid Mattson',
      password: '' }

    const res = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const message = JSON.parse(res.text)
    expect( message.error ).toMatch( /Password required/ )

    const usersInDB = await testHelper.getUsersFromDB()
    expect( usersInDB.length ).toBe( 1 )
  })

  test('Password less than 3 characters is no good here', async () => {
    const userToAdd = {
      username: 'leonidas',
      name: 'Leonid Mattson',
      password: 'pa' }

    const res = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const message = JSON.parse(res.text)
    expect( message.error ).toMatch( /Password must contain at least 3 characters/ )

    const usersInDB = await testHelper.getUsersFromDB()
    expect( usersInDB.length ).toBe( 1 )
  })

  test('Username must be unique', async () => {
    const userToAdd = {
      username: 'vertigo',
      name: 'Heidi Pilvi',
      password: 'xcvmxcvm-12312' }

    const res = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const message = JSON.parse(res.text)
    expect( message.error ).toMatch( /User validation failed: username: Error/ )

    const usersInDB = await testHelper.getUsersFromDB()
    expect( usersInDB.length ).toBe( 1 )
  })
})

afterAll(() => mongoose.connection.close())