import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import db_connect from './services/mongoDB.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

dotenv.config();








app.listen(port, () => {
    db_connect();
    console.log(`Server is running on port ${port} ✅`);
})