import mongoose from "mongoose";

function validAddCategory(req, res, next) {
    try {
        const {name, numOfBooks} = req.body;

        if( typeof name !== "string" )
            return res.status(400).json({ message: `Name is required: ${name}` });

        if( typeof numOfBooks !== "number" )
            return res.status(400).json({ message: `number is required: ${numOfBooks}` });

        req.good_val = {name, numOfBooks};

        next();

    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

export {validAddCategory};