const APIError = require("../utils/APIError");

const CastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new APIError(message, 404);
};

const errDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errStack: err.stack,
  });
};
const errPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: "fail",
      message: `something went Wrong`,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = CastErrorDB(error);
    errPro(error, res);
  }
};
