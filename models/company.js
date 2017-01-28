module.exports = (pg, options, done) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Companies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )`
  );
  createQuery.on('end', () => { client.end(); done(); });
};
