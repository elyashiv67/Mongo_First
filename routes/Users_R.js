import express from 'express';
import {createUser, deleteUser, getAllUsers, getUserById, getUsersByAuthor, updateUser} from "../controllers/Users_C.js";
import {ValidId} from "../middleware/global_MID.js";
import {validValuesToAdd, validValuesToUpdate} from "../middleware/Users_MID.js";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/authors', getUsersByAuthor);
router.get('/:id', ValidId, getUserById);
router.post('/add', validValuesToAdd, createUser);
router.patch('/:id',ValidId, validValuesToUpdate, updateUser);
router.delete('/:id',ValidId,deleteUser);


export default router;