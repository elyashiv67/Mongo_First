import express from 'express';
import {
    borrowBook,
    createBook,
    deleteBook,
    getAllBooks, getAllBooksByCategory,
    getBookById,
    getBooksByCategory, getUserOfBook, returnBook,
    updateBook
} from "../controllers/Books_C.js";
import {ValidId} from "../middleware/global_MID.js";
import {validAddBook, validUpdateBook} from "../middleware/Books_MID.js";

const router = express.Router();

router.get('/', getAllBooks);
router.get('/byCategory', getAllBooksByCategory);
router.get('/:id', ValidId, getBookById);
router.get('/takenBy/:id', ValidId, getUserOfBook);
router.get('/byCategory/:id',ValidId, getBooksByCategory);
router.post('/create', validAddBook , createBook);
router.post('/borrow',borrowBook);
router.post('/return', returnBook);
router.patch('/:id', ValidId,validUpdateBook, updateBook);
router.delete('/:id', ValidId, deleteBook);

export default router;