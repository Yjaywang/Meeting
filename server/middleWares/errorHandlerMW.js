function finalErrorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(500).send({
    error: true,
    message: `server error: ${err.message}`,
  });
}

function multerErrorHandler(err, req, res, next) {
  console.error(err.stack);
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(400).send({ error: true, message: "File larger than 5MB" });
  } else {
    next(err);
  }
}

module.exports = { finalErrorHandler, multerErrorHandler };
