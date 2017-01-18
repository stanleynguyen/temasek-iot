module.exports = (pg, options) => {
  const client = new pg.Client(options);
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Organisers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      company_id INT NOT NULL,
      FOREIGN KEY (company_id) REFERENCES Companies(id)
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
