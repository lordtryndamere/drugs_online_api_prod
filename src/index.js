const express = require('express');
const morgan  = require('morgan');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const dotenv = require('dotenv');

const  routers  = require('./routers');
dotenv.config();
const port = process.env.PORT || 8087
const initializeDb  = require('./config/typeorm')
async function init(){
    await  initializeDb()
}
init()

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())
app.use(helmet());



app.use(routers())
app.listen(port, () => {
console.log(`server on port ${port}`);
});