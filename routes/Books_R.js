import express from 'express';
import {createBook, deleteBook, getAllBooks, getBookById, getBooksByCategory, updateBook} from "../controllers/Books_C.js";
import {ValidId} from "../middleware/global_MID.js";
import {validAddBook, validUpdateBook} from "../middleware/Books_MID.js";

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', ValidId, getBookById);
router.get('/:id/books',ValidId, getBooksByCategory);
router.post('/', validAddBook , createBook);
router.patch('/:id', ValidId,validUpdateBook, updateBook);
router.delete('/:id', ValidId, deleteBook);

export default router;