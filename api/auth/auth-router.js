const router = require('express').Router();
const User = require('./auth-model')
const {checkUsernameExists, checkUsernameFree, requiredValues} = require('./auth-middleware')

const {JWT_SECRET} = require('../middleware/secrets')

const jwt = require('jsonwebtoken')


const bcrypt = require('bcrypt')





router.post('/register', requiredValues, checkUsernameFree, (req, res, next) => {
  // res.end('implement register, please!');

    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const user = { username, password: hash };

  User.add(user)
    .then((saved)=>{
      res.status(201).json(saved)
    })
    .catch(err=>{
      next(err);

    })



  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login',requiredValues ,checkUsernameExists, (req, res, next) => {
  // res.end('implement login, please!');
  // const {password} = req.body;

  if(bcrypt.compareSync(req.body.password, req.user.password)){
    const token = buildToken(req.user)

    // req.session.user = req.user
    res.status(200).json( {message: `Welcome ${req.user.username}`,
    token,
  })

  }else{
    next({status: 401, message: "Invalid credentials"})
  }

});

function buildToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}



module.exports = router;
