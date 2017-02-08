module.exports = (pg, options) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Votes (
      id SERIAL PRIMARY KEY,
      voter_id INT NOT NULL,
      question_id INT NOT NULL,
      choice INT NOT NULL,
      FOREIGN KEY (voter_id) REFERENCES Voters(id),
      FOREIGN KEY (question_id) REFERENCES Questions(id)
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
