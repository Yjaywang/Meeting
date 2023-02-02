function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({
    error: true,
    message: `server error: ${err.message}`,
  });
}

module.exports = { errorHandler };
