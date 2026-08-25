import express from 'express';
import {ValidId} from "../middleware/global_MID.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/Categories_C.js";
import {validAddCategory} from "../middleware/Categories_MID.js";

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', ValidId, getCategoryById);
router.post('/add',validAddCategory, createCategory);
router.patch('/:id',ValidId, updateCategory);
router.delete('/:id', ValidId, deleteCategory);


export default router;