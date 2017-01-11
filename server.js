if (process.env.NODE_ENV === 'dev') require('dotenv').load();

const express = require('express');

const dbQuery = require('./models/db');

const app = express();

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log(`UP AND RUNNING AT ${process.env.PORT}`); // eslint-disable-line no-console
});
