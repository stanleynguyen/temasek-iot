module.exports = (pg, options) => {
  const client = new pg.Client(options);
  client.connect();
  const createQuery = client.query(
    `CREATE TABLE IF NOT EXISTS Choices (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      question_id INT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES Questions(id)
    )`
  );
  createQuery.on('end', () => { client.end(); });
};
