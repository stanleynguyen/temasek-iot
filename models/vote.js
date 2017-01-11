module.exports = (pg, options) => {
  const client = new pg.Client(options);
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Votes (
      id SERIAL PRIMARY KEY,
      voter_id INT NOT NULL,
      choice_id INT NOT NULL,
      FOREIGN KEY (voter_id) REFERENCES Voters(id),
      FOREIGN KEY (choice_id) REFERENCES Choices(id)
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
