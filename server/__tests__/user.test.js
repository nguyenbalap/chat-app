const request = require('supertest')
const app = require('../index')
const User = require('../model/User')

describe('LOGIN', function() {
  beforeAll(async () => {
    await User.deleteMany({})
    const user = new User({
      email: 'user@example.com',
      name: 'example user',
      password: '123456'
    })
    await user.save();
  })

  afterAll(async () => {
    await User.deleteMany({});
  })

  describe('Post /api/v1/users/login', function() {
    it('login success', async function() {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user@example.com',
        password: '123456'
      })
      expect(res.status).toBe(200)
    })
  })

  describe('Post /login', () => {
    it('should return error: email is required', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        password: '123456'
      })
      expect(res.statusCode).toBe(422)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('Post /login', () => {
    it('should return error: email is not empty', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: '',
        password: '123456'
      })
      expect(res.statusCode).toBe(422)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('Post /login', () => {
    it('should return error: password is required', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user@example.com'
      })
      expect(res.statusCode).toBe(422)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('Post /login', () => {
    it('should return error: password is not empty', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user@example.com',
        password: ''
      })
      expect(res.statusCode).toBe(422)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('Post /login', () => {
    it('should return error: user not exit', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user1@example.com',
        password: '123456'
      })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('Post /login', () => {
    it('should return error: invalid password', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user@example.com',
        password: '1234567'
      })
      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty('message')
    })
  })

  describe('Post /login', () => {
    it('should return success: login success', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'user@example.com',
        password: '123456'
      })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('message')
    })
  })
})

describe('REGISTER', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  })

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/users/register', function() {
    it('register success', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        name: 'test',
        password: '123456'
      })
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: email is required', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        name: 'test',
        password: '123456'
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: email not be empty', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: '',
        name: 'test',
        password: '123456'
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: name is required', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        password: '123456'
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: name not be empty', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        name: '',
        password: '123456'
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: password is required', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        name: 'test'
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: password not be empty', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        name: 'test',
        password: ''
      })
      expect(res.status).toEqual(422)
      expect(res.body).toHaveProperty('message') 
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: password greater than 6 character', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test@example.com',
        name: 'test',
        password: '12345'
      })
      expect(res.status).toEqual(500)
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: value is valid email address', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'testxyz',
        name: 'test',
        password: '123456'
      })
      expect(res.status).toEqual(500)
    })
  })

  describe('POST /api/v1/users/register', function() {
    it('should return error: email already exit', async function() {
      const res = await request(app).post('/api/v1/users/register').send({
        email: 'test1@example.com',
        name: 'test',
        password: '123456'
      })
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('message')

      const res1 = await request(app).post('/api/v1/users/register').send({
        email: 'test1@example.com',
        name: 'test',
        password: '123456'
      })
      expect(res1.status).toEqual(500)
    })
  })

});



