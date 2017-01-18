const bcrypt = require('bcrypt');

module.exports.initialize = (pg, options) => {
  const client = new pg.Client(options);
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Organisers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      company_id INT NOT NULL,
      FOREIGN KEY (company_id) REFERENCES Companies(id)
    )`
  );
  createQuery.on('end', () => { client.end(); });
};

module.exports.encryptPassword = (password) => bcrypt.hashSync(password, 10);

module.exports.checkPassword = (password, hash) => bcrypt.compareSync(password, hash);
