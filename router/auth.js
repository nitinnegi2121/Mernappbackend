const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate")


require('../db/connection');

const User = require('../models/userSchema');

// Middleware to parse JSON request bodies
router.use(express.json());

router.get('/', (req, res) => {
   res.send("Hello, router world");
});


//using promises
// router.post('/register', (req, res) => {


//    const {name, email, phone, work, password, cpassword} = req.body;

//    if( !name || !email || !phone || !work || !password || !cpassword){

//       return res.status(422).json({Error: "plaese fill the field properly"})
//    }

//    User.findOne({email : email})
//    .then((userExist)  =>{

//       if(userExist){
//          return res.status(422).json({Error: "user already exists"});
//       }

//       const user = new User({name,  email, phone, work, password, cpassword});

//       user.save().then(() =>{
//          res.status(201).json({message: "user registered successfully"});
//       }).catch((Error) =>{
//          res.status(501).json({Error : "failed to register"});
//       })
//    }).catch((err) =>{ console.log(err)});

// });

//using async await
router.post('/register', async (req, res) => {


   const { name, email, phone, work, password, cpassword } = req.body;

   if (!name || !email || !phone || !work || !password || !cpassword) {

      return res.status(422).json({ Error: "plaese fill the field properly" })
   }

   try {

      const userExist = await User.findOne({ email: email })

      if (userExist) {
         return res.status(422).json({ error: "Email already exists" });


      } else if (password != cpassword) {
         return res.status(422).json({ error: "password is not matching" });

      } else {

         const user = new User({ name, email, phone, work, password, cpassword });

         //hasing the password before save the details

         await user.save();

         res.status(201).json({ message: "user registered successfully" });

      }


   } catch (err) {
      console.log(err)

   };



});

//login route

router.post('/signin', async (req, res) => {
   let token;
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).json({ error: "please fill the data" });
      }
      const userLogin = await User.findOne({ email: email })
      // console.log(userLogin);

      if (userLogin) {
         const isMatch = await bcrypt.compare(password, userLogin.password);
         token = await userLogin.generateauthToken();
         console.log(token);
         // res.cookie("jwtoken", token, {
         //    expires:new Date (Date.now()+2230000 ),
         //    httpOnly: true
         // })



         if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials pass" })
         }
         else {
            res.json({ message: "user signin successfully", token: token })
         }

      } else {
         res.status(400).json({ error: "Invalid credentials" })
      }

   } catch (error) {

      console.log(error);
   }
})


//about us page

router.get('/about', authenticate, (req, res) => {
   console.log("This is about")
   res.send(req.rootUser);

});


//get user data for contact us and home page
router.get('/getdata', authenticate, (req, res) => {
   console.log("This is about");
   res.send(req.rootUser);
 });

//contact page
router.post('/contact', authenticate, async (req, res) => {

   try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !phone || !message) {
         console.log("error in contact form");
         return res.json({ error: "please filled the contact form" })
      }
      const userContact = await User.findOne({ _id: req.userID })

      if (userContact) {

         const userMessage = await userContact.addMessage(name, email, phone, message);
         await userContact.save();
         res.status(201).json({ message: "user contact successfully" });
      }

   } catch (error) {

      console.log("error");
   }

});

//logout page
router.get('/logout', (req, res) => {
   console.log("logout page");
   res.clearCookie('jwtoken', { path: '/' })
   res.status(200).send("User logout successfully");

});
module.exports = router;
