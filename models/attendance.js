module.exports = (pg, options, done) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Attendances (
      id SERIAL PRIMARY KEY,
      event_id INT NOT NULL,
      voter_id INT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES Events(id),
      FOREIGN KEY (voter_id) REFERENCES Voters(id)
    )`
  );
  createQuery.on('end', () => { client.end(); done(); });
};
