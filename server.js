if (process.env.NODE_ENV === 'dev') require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('secret', process.env.SECRET);

app.use(require('./api'));

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log(`UP AND RUNNING AT ${process.env.PORT}`); // eslint-disable-line no-console
});
