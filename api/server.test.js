const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
const User = require('./auth/auth-model')

const Jokes = require('./jokes/jokes-router')



beforeAll(async () => {
  await db.migrate.rollback();  
  await db.migrate.latest();   
});

beforeEach(async () => {
  await db('users').truncate();
  await db('users')
      .insert([
          { username: 'Frodo', password: 'frod123' },
          { username: 'Merry', password: 'mer123' },
         
      ])
});

afterAll(async () => {
  await db.destroy();
});


test('make sure our environment is set correctly', ()=>{
  expect(process.env.NODE_ENV).toBe('testing');
})

describe('Endpoints test', () =>{

  test('Get /jokes', async ()=>{
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3)
  })

  test('POST /auth/login', async ()=>{
    let res = await request(server).post('/api/auth/login').send({ username: 'luis', password: 'luis' });
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({"message": "Invalid credentials"});

  })

  test('POST /auth/register', async ()=>{
    let res = await request(server).post('/api/auth/register').send({ username: 'sama', password: 'sama123' });
    expect(res.status).toBe(201);
    expect(res.body).toBeTruthy();

  })



})