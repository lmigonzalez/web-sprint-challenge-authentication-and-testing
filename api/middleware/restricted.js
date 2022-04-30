const { JWT_SECRET } = require("./secrets");
// const { findBy } = require("../auth/auth-model");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  const token = req.headers.cookie;
  // console.log(token)
  if (token == null) {
    next({
      status: 401,
      message: "token required",
    });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({
          status: 401,
          message: err,
        });
      } else {
        req.decodedToken = decodedToken
        next();
      }
    });
  }
};

// const token = req.headers.authorization
// console.log(req.headers.authorization)
// if (!token) {
//   next({
//     status: 401,
//     message: req.headers
//   });
// } else {
//   jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
//     if (err) {
//       next({ status: 401, message: "Token invalid" });
//     } else {
//       req.decodedToken = decodedToken;
//       next(decodedToken);
//     }
//   });
// }
