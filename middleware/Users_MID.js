import mongoose from "mongoose";

const ROLES = ['admin', 'user', 'author'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validValuesToAdd(req, res, next) {
    try {
        const {name, phone, email, address, books, role} = req.body;

        if (typeof name !== 'string' || name.trim().length === 0)
            return res.status(400).json({message: 'Name must be a valid, non-empty string'});

        if (typeof phone !== 'string' || phone.trim().length === 0 || phone.length > 10)
            return res.status(400).json({message: 'Phone must be a valid string of at most 10 characters'});

        if (typeof email !== 'string' || !EMAIL_REGEX.test(email))
            return res.status(400).json({message: 'Email must be a valid email address'});

        if (typeof address !== 'string' || address.trim().length === 0)
            return res.status(400).json({message: 'Address must be a valid, non-empty string'});

        const valid_val = {name, phone, email, address};

        if (books !== undefined) {
            if (!Array.isArray(books) || !books.every(id => mongoose.isValidObjectId(id)))
                return res.status(400).json({message: 'Books must be an array of valid book ids'});

            valid_val.books = books;
        }

        if (role !== undefined) {
            if (!ROLES.includes(role))
                return res.status(400).json({message: `Role must be one of: ${ROLES.join(', ')}`});

            valid_val.role = role;
        }

        req.valid_val = valid_val;
        next();

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

function validValuesToUpdate(req, res, next) {
    try {
        const {name, phone, email, address, books, role} = req.body;

        const valid_val = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0)
                return res.status(400).json({message: 'Name must be a valid, non-empty string'});

            valid_val.name = name;
        }

        if (phone !== undefined) {
            if (typeof phone !== 'string' || phone.trim().length === 0 || phone.length > 10)
                return res.status(400).json({message: 'Phone must be a valid string of at most 10 characters'});

            valid_val.phone = phone;
        }

        if (email !== undefined) {
            if (typeof email !== 'string' || !EMAIL_REGEX.test(email))
                return res.status(400).json({message: 'Email must be a valid email address'});

            valid_val.email = email;
        }

        if (address !== undefined) {
            if (typeof address !== 'string' || address.trim().length === 0)
                return res.status(400).json({message: 'Address must be a valid, non-empty string'});

            valid_val.address = address;
        }

        if (books !== undefined) {
            if (!Array.isArray(books) || !books.every(id => mongoose.isValidObjectId(id)))
                return res.status(400).json({message: 'Books must be an array of valid book ids'});

            valid_val.books = books;
        }

        if (role !== undefined) {
            if (!ROLES.includes(role))
                return res.status(400).json({message: `Role must be one of: ${ROLES.join(', ')}`});

            valid_val.role = role;
        }

        req.valid_val = valid_val;
        next();

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export { validValuesToAdd, validValuesToUpdate };
