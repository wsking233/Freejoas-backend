const jwt = require('jsonwebtoken');
const expireTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// const expireTime = 30*1000; // 30 seconds in milliseconds

////////////////////////////////////////////
const dotenv = require('dotenv').config();  //use this in local environment only
////////////////////////////////////////////

const TOKEN_SECRET = process.env.TOKEN_SECRET;  //get the token secret from the environment variables

function createToken(user) {
  //create a token with the user object
  const payload = {
    _id: user._id,  //get the _id from the user object
    accountType: user.accountType,  //get the accountType from the user object
    iat: Date.now(),
    exp: Date.now() + expireTime
  };
  console.log('payload:', payload);
  console.log("Token create successfully!");
  //use the jwt.sign method to create a token
  return jwt.sign(payload, process.env.TOKEN_SECRET);   
}

function verifyToken(req, res, next) {
    //get the token from the Authorization header
    const token = req.headers.authorization;  
    if(!token) {  //check if the token is present
        console.log("No Authorization header found");
        return res.status(401).send({ message: 'No Authorization header found' });
    }

    //split the token
    const splitToken = token.split(' ');
    if(splitToken.length !== 2 || splitToken[0] !== 'Bearer') { //check if the token format is valid
        console.log("Invalid token format");
        return res.status(401).send({ message: 'Invalid token format' });
    }

    //verify the token
    jwt.verify(splitToken[1], TOKEN_SECRET, { ignoreExpiration: false }, (error, decoded) => {
      if (error) {
        //return a 401 status code if the token is invalid
        console.log("Invalid token");
        return res.status(401).send({ message: 'Invalid token' });
      } 
      //check if the token has expired
      if(decoded.exp <= Date.now()) {
        console.log("iats:", new Date(decoded.iat).toISOString());
        console.log("exps:", new Date(decoded.exp).toISOString());
        console.log("Date.now:", new Date(Date.now()).toISOString());
        console.log("Token has expired");
        return res.status(401).send({ message: 'Token has expired' });
      }
      req.decodedToken = decoded; //set the decoded token to the req object
      console.log("Token verified successfully!");
      next();
  });
}

function checkPermission(requiredAccountTypes) {
  return (req, res, next) => {
    const accountType = req.decodedToken.accountType; //get the accountType from the token

    //check if the requiredAccountTypes includes the accountType
    if (!requiredAccountTypes.includes(accountType)) {  
      //return a 403 status code if the requiredAccountTypes does not include the accountType
      console.log("Permission denied");
      return res.status(403).send({ message: 'Permission denied' });
    }
    console.log("Permission granted");
    next(); 
  };
}

module.exports = {
  createToken,
  verifyToken,
  checkPermission
};