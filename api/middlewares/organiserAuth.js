module.export = (req, res, next) => {
  if (!req.user) return res.status(403).send('Unauthorized');
  return next();
};
