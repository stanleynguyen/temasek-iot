const pg = require('pg');
const escape = require('pg-escape');

const options = {
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
};

//import models
require('async').waterfall([
  (done) => {
    require('./company')(pg, options, done);
  },
  (done) => {
    require('./organiser').initialize(pg, options, done);
  },
  (done) => {
    require('./event')(pg, options, done);
  },
  (done) => {
    require('./question')(pg, options, done);
  },
  (done) => {
    require('./choice')(pg, options, done);
  },
  (done) => {
    require('./voter')(pg, options, done);
  },
  (done) => {
    require('./attendance')(pg, options, done);
  },
  require('./vote').bind(null, pg, options)
]);

function dbQuery(queryString, callback) {
  const client = new pg.Client(options);
  client.connect();
  const sql = escape(queryString);
  const query = client.query(sql);
  let results = [];
  query.on('row', (row) => {
    results.push(row);
  });
  query.on('error', (err) => {
    callback(err);
  });
  query.on('end', () => {
    callback(null, results);
    client.end();
  });
}

module.exports = dbQuery;
