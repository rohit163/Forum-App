const express = require("express");

//It is a HTTP request logger middleware for Node. js.
// It simplifies the process of logging requests to your application
const morgan = require('morgan')

//to get access to the post data we have to use body-parser
const bodyParser = require('body-parser')

//It allows AJAX requests to skip the Same-origin policy and access resources from remote hosts.
const cors = require('cors')
//Config .env to ./config/config.env
require('dotenv').config({
  path: './config/config.env'
})



const connectDB = require('./config/db')
const app = express(); // create express app

//connetct to DB
connectDB()
//using body-parser
app.use(bodyParser.json())


//config for only develop
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: process.env.CLIENT_URL
  }))
  app.use(morgan('dev'))
  //Morgan give information about each request
  //cors it allows to deal with react for localhost at port 3000 without any problem
}

//load all route
const authRouter = require('./routes/auth.route')

//use Routes
app.use('/api/', authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'PAGE NOT FOUND'
  })
});
const PORT = process.env.PORT;


// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});