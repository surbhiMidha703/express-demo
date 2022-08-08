const log = (req, res, next) => {
  //custom middleware
  console.log("logging...");
  next();
};

module.exports = log;
