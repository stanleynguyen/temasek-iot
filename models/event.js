module.exports = (pg, options) => {
  const client = new pg.Client(options);
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Events (
      id SERIAL PRIMARY KEY
      name TEXT NOT NULL
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
