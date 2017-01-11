module.exports = (pg, options) => {
  const  client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Questions (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
