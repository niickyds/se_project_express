const errorHandler = (err, req, res, next) => {
  console.error(err);
  console.log(res);
  console.log(req);

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = { errorHandler };
