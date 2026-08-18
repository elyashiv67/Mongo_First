import express from "express";
import Caterories_R from "./Caterories_R.js";

const router = express.Router();

router.use('/cat' , Caterories_R);

export default router;