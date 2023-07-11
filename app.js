// const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

dotenv.config({path: './config.env'});

require('./db/connection');


//we link the router files to make our route easy
app.use(require('./router/auth'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT


  app.get('/signin', (req, res)=>{
     res.send("hello login world");
  
  });
 

 
  app.listen(PORT, (req, res) => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });
 