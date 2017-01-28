module.exports = (pg, options, done) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Events (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company_id INT NOT NULL,
      FOREIGN KEY (company_id) REFERENCES Companies(id)
    )`
  );
  createQuery.on('end', () => { client.end(); done(); });
};
