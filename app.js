const express = require('express');
const app = express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const cors = require('cors');

const userRoute = require('./routes/login');
const expenseRoute = require('./routes/expense');
const orderRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');

app.use(cors());

app.use(bodyParser.json());

app.use('/',userRoute);
app.use('/',expenseRoute);
app.use('/',orderRoute);
app.use('/',premiumRoute);

app.use((req,res) => {
  console.log('urll',req.url);
  console.log("added extra logs");
});

mongoose.connect('mongodb+srv://nishibiswasroy:littlebiswasroy@cluster0.u0oquqd.mongodb.net/expense?retryWrites=true&w=majority').then(result =>{
  console.log('Connected');
app.listen(4000);
})
.catch(error => {
  console.log(error);
});