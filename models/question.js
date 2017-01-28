module.exports = (pg, options, done) => {
  const  client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Questions (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      event_id INT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES Events(id)
    )`
  );
  createQuery.on('end', () => { client.end(); done(); });
};
