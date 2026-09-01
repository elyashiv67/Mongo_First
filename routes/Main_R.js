import express from "express";
import CategoriesRoute from "./Caterories_R.js";
import BooksRoute from '../routes/Books_R.js';
import UserRoute from '../routes/Users_R.js';

const router = express.Router();

router.use('/cat' , CategoriesRoute);
router.use('/books' , BooksRoute);
router.use('/users', UserRoute);


export default router;