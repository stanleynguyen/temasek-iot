if (process.env.NODE_ENV === 'dev') require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('./api'));

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log(`UP AND RUNNING AT ${process.env.PORT}`); // eslint-disable-line no-console
});
