module.exports = (pg, options) => {
  const client = new pg.Client(options);
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Voters (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      nric TEXT NOT NULL,
      phone INT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      shares TEXT NOT NULL
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
