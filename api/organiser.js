const router = require('express').Router();
const jwt = require('jsonwebtoken');

const dbQuery = require('../models/db');
const organiserAuth = require('./middlewares/organiserAuth');
const organiserModel = require('../models/organiser');

// authenticattion routes
router.post('/authenticate/login', (req, res) => {
  dbQuery(
    `SELECT *
    FROM Organisers
    WHERE email='${req.body.username}'`,
    (err, u) => {
      if (err) return res.status(500).send('Database Error');
      if (u.length === 0) return res.status(403).send('No User Found');
      if (!organiserModel.checkPassword(req.body.password, u[0].password)) return res.status(403).send('Wrong credentials');
      const token = jwt.sign(u[0], process.env.SECRET, { expiresIn:  '720h'});
      res.status(200).json({ success: true, token });
    }
  );
});

router.get('/my-info', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT name
    FROM Companies
    WHERE id=${req.user.company_id}`,
    (err, company) => {
      if (err) return res.status(500).send('Server Error');
      res.status(200).json({
        email: req.user.email,
        company: company[0].name
      });
    }
  );
});

router.post('/password', organiserAuth, (req, res) => {
  const hashedPassword = organiserModel.encryptPassword(req.body.password);
  dbQuery(
    `SELECT password FROM Organisers
    WHERE id=${req.user.id}`,
    (err, u) => {
      if (err || u.length === 0) return res.status(500).send('Database Error');
      if (!organiserModel.checkPassword(req.body.oldPassword, u[0].password)) return res.status(403).send('Unauthorized');
      dbQuery(
        `UPDATE Organisers
        SET password='${hashedPassword}'
        WHERE id=${req.user.id}`,
        (err) => {
          if (err) return res.status(500).send('Database Error');
          res.status(200).send('OK');
        }
      );
    }
  );
});

// voters operations
router.get('/voter/all', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters
    WHERE phone_verified=TRUE
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/voter/unverified', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters
    WHERE phone_verified=TRUE
    AND organiser_verified=FALSE
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/voter/join', organiserAuth, (req, res) => {
  let { voterId, eventId } = req.body;
  dbQuery(
    `INSERT INTO Attendances (event_id, voter_id)
    SELECT e.id, v.id FROM Events e, Voters v
    WHERE e.id=${eventId} AND v.id=${voterId}
    AND e.company_id=v.company_id
    AND e.company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.get('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Voters
    SET organiser_verified=TRUE
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Voters
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// events operations
router.get('/event/all', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT e.id, e.name, e.started, e.ended,
    CASE WHEN COUNT(q)=0 THEN '[]'
    ELSE json_agg(q) END AS questions,
    CASE WHEN COUNT(v)=0 THEN '[]'
    ELSE json_agg(v) END AS voters
    FROM Events e
    LEFT JOIN Questions q ON e.id=q.event_id
    LEFT JOIN (
      SELECT DISTINCT v.*, a.event_id
      FROM Voters v, Attendances a
      WHERE v.id=a.voter_id
    ) v ON e.id=v.event_id
    WHERE e.company_id=${req.user.company_id}
    GROUP BY e.id`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/event/current', organiserAuth, (req, res) => {
  dbQuery('SELECT * FROM Events WHERE started=TRUE AND ended=FALSE', (err, results) => {
    if (err) return res.status(500).send('Database Error');
    res.status(200).json(results);
  });
});

router.get('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT e.id, e.name, e.started, e.ended,
    CASE WHEN COUNT(q)=0 THEN '[]'
    ELSE json_agg(q) END AS questions
    FROM Events e LEFT JOIN Questions q ON e.id=q.event_id
    WHERE company_id=${req.user.company_id}
    AND e.id=${req.params.id}
    GROUP BY e.id`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/event', organiserAuth, (req, res) => {
  dbQuery(
    `INSERT INTO Events (name, company_id, started, ended)
    VALUES ('${req.body.name}', ${req.user.company_id}, FALSE, FALSE)`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.put('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Events
    SET name=${req.body.name}
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.post('/event/:id/start', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Events
    SET started=TRUE
    WHERE id=${req.params.id}
    AND ended=FALSE`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.post('/event/:id/end', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Events
    SET ended=TRUE
    WHERE id=${req.params.id}
    AND started=TRUE`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Events
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// questions operations
router.post('/question', organiserAuth, (req, res) => {
  let { question, choices, eventId } = req.body;
  choices = choices.reduce((sum, c) => sum + `"${c}",`, '');
  choices = `{${choices.substring(0, choices.length-1)}}`;
  dbQuery(
    `INSERT INTO Questions (question, choices, event_id)
    VALUES ('${question}', '${choices}', (
      SELECT e.id FROM Events e
      WHERE e.id=${eventId}
      AND e.company_id=${req.user.company_id}
    ))`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/question/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Questions WHERE id=${req.params.id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

module.exports = router;
