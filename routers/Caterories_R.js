import express from 'express';
import {ValidId} from "../middleware/global_MID.js";
import {createCategory, getAllCategories, getCategoryById} from "../controllers/Categories_C.js";

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', ValidId, getCategoryById);
router.post('/add', createCategory);


export default router;