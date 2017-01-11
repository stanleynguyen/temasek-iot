if (process.env.NODE_ENV === 'dev') require('dotenv').load();

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('OK');
});
