// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");



// const Authenticate = async(req, res, next) =>{
//     try{
//         const token = req.cookies.jwtoken;
//         const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
//         const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token": token});
//         if(!rootUser){throw new Error('user not found')}
//         req.token = token;
//         req.rootUser = rootUser;
//         req.userID = rootUser._id;
//         next();
//     }catch(err){
//         res.status(401).send("Unauthorized: No web token")
//         console.log(err)
//     }
// }


// module.exports = Authenticate;

const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    if (!token) {
      throw new Error('Unauthorized: No web token');
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifyToken._id, 'tokens.token': token });
    if (!rootUser) {
      throw new Error('Unauthorized: Invalid user');
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized: Invalid token');
  }
};



module.exports = authenticate;
