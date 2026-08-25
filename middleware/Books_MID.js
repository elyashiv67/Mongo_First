import mongoose from "mongoose";

function validAddBook(req, res, next) {
    try {
        const { title, author, category, date_taken } = req.body;

        // need to learn and add zod for security

        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title must be a valid, non-empty string' });
        }

        if (!mongoose.isValidObjectId(author) || !mongoose.isValidObjectId(category)) {
            return res.status(400).json({ error: 'Category or author must be valid ObjectIds' });
        }

        if (!date_taken || isNaN(Date.parse(date_taken))) {
            return res.status(400).json({ error: 'Date taken must be a valid date' });
        }

        req.valid_val = { title, author, category, date_taken };
        next();

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

function validUpdateBook(req, res, next) {
    try {
        const { title, author, category, date_taken, date_back, isTaken } = req.body;

        const valid_val = {}

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length === 0)
                return res.status(400).json({ error: 'Title must be a valid, non-empty string' });

            valid_val.title = title;
        }

        if (author !== undefined) {
            if(!mongoose.isValidObjectId(author))
                return res.status(400).json({ error: 'Author must be a valid' });

            valid_val.author = author;
        }

        if(category !== undefined){
            if(!mongoose.isValidObjectId(category))
                return res.status(400).json({ error: 'Category must be a valid' });

            valid_val.category = category;
        }

        if(date_taken !== undefined){
            if(isNaN(Date.parse(date_taken)))
                return res.status(400).json({ error: 'Date taken must be a valid date' });

            valid_val.date_taken = date_taken;
        }

        if(date_back !== undefined){
            if(isNaN(Date.parse(date_back)))
                return res.status(400).json({ error: 'Date back must be a valid date' });

            valid_val.date_back = date_back;
        }

        if(isTaken !== undefined){
            if(typeof isTaken !== 'boolean')
                return res.status(400).json({ error: 'isTaken must be boolean' });

            valid_val.isTaken = isTaken;
        }

        req.valid_val = valid_val;
        next();
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export { validAddBook , validUpdateBook};