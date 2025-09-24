class apiError extends Error {
    constructor(status,message) {
        super (message)
        this.status=status
    }
}
const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
  });
};

module.exports={ apiError,errorHandler}
