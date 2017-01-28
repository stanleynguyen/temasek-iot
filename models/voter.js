module.exports = (pg, options, done) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Voters (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      nric TEXT NOT NULL UNIQUE,
      country_code INT NOT NULL,
      phone INT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      company_id INT NOT NULL,
      shares TEXT NOT NULL,
      phone_verified BOOLEAN NOT NULL,
      organiser_verified BOOLEAN NOT NULL,
      FOREIGN KEY (company_id) REFERENCES Companies(id)
    )`
  );
  createQuery.on('end', () => { client.end(); done(); });
};
