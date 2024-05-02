const express = require('express');
const path=require('path');
const businessroutes = require("./routes/businessroutes");
const customerroutes = require("./routes/customerroutes");
const adminroutes=require("./routes/adminroutes");
const {connectToDb,getDb}=require('./db');
const multer = require('multer');
const app = express();
const morgan=require("morgan");
const rfs=require("rotating-file-stream");
const cors = require('cors');
let db; 


var accessLogStream = rfs.createStream("access.log", {
    interval: '1m', // rotate daily
    path: path.join(__dirname, 'log')
})

//connects to the database and server starts listening 
connectToDb((error)=>{
    if(!error){
        //only if the connection is created the server starts listening
        app.listen(4000,()=>{
            console.log('Server listening on : http://localhost:4000/api');
        })
        db=getDb();
    }
})

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(morgan('combined', {stream: accessLogStream}))
// app.use(morgan(":method :url :status :res[content-length] :total-time " ))

app.use("/api/admin",adminroutes);

app.use('/api/customer', customerroutes);

app.use("/api",businessroutes);

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your website',
    },
    servers: [
      {
        url: 'https://projectfym-1.onrender.com/api',
        description: 'Deployed server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUi = require('swagger-ui-express');


app.get('/', (req, res)=>{
  res.send('<h1>SERVER is running<h1>');
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res)=>{
  res.send('<h1>SERVER is running<h1>');
});


app.use((error,req,res,next)=>{
    console.error(error.stack);
    console.log("middlewaree")
    res.status(500).send("Some Error Occured");
})


