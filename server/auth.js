const jwt = require('jsonwebtoken');
// const expireTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const expireTime = 3000; 

const dotenv = require('dotenv').config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

function createToken(user) {
  const payload = {
    _id: user._id,
    accountType: user.accountType,
    iat: Date.now(),
    exp: Date.now() + expireTime
  };
  console.log('payload:', payload);
  console.log("Token create successfully!");
  return jwt.sign(payload, process.env.TOKEN_SECRET); 
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if(!token) {
        console.log("No Authorization header found");
        return res.status(401).send({ message: 'No Authorization header found' });
    }

    //split the token
    const splitToken = token.split(' ');
    if(splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
        console.log("Invalid token format");
        return res.status(401).send({ message: 'Invalid token format' });
    }

    jwt.verify(splitToken[1], TOKEN_SECRET,{ignoreExpiration: false}, (error) => {
        if(error) {
            console.log("Invalid or expired token");
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        console.log("Token verified successfully!");
        next();
    });
}

module.exports = {
  createToken,
  verifyToken
};