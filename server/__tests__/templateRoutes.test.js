const express = require('express');
const request = require('supertest');
const routes = require('../routes/templateRoutes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(`mongodb://localhost:27017/nyala`);
    }
})

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }});

describe('GET /templates', () => {
    it('should respond with an array of templates', async () => {
      const response = await request(app).get('/templates');
      expect(response.body).toEqual(expect.any(Array));
      expect(response.statusCode).toBe(200);
    }, 10000); // Set timeout to 10 seconds
  });
  
  describe('GET /templates/:id', () => {
    it('should respond with a template', async () => {
      const response = await request(app).get('/templates/Fe2312d32w');
      expect(response.body).toEqual(expect.any(Object));
      expect(response.statusCode).toBe(200);
    }, 10000); // Set timeout to 10 seconds
  
    it('should respond with an error', async () => {
      const response = await request(app).get('/templates/100');
      expect(response.body).toEqual({ error: 'Email not found' });
      expect(response.statusCode).toBe(404);
    }, 10000); // Set timeout to 10 seconds
  });
  