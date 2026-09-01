import Book from '../module/Books.js';
import Category from '../module/Categories.js';
import User from '../module/Users.js';
import mongoose from "mongoose";

async function getAllBooks(req, res) {
    try {
        const books = await Book.find();

        if (books.length === 0) {
            return res.status(404).json({message: 'No books found'});
        }

        return res.status(200).json(books);

    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getBookById(req, res) {
    try {
        const id = req.id;
        const book = await Book.findById(id);

        if (!book)
            return res.status(404).json({message: 'Book not found'});

        return res.status(200).json(book);

    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getBooksByCategory(req, res) {
    try {
        const categoryId = req.id;
        const books = await Book.find({category: categoryId});

        if (books.length === 0)
            return res.status(404).json({message: 'No books found'});

        return res.status(200).json(books);

    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function createBook(req, res) {
    let category_updated = false;
    try {
        const {title, category, author, date_taken} = req.valid_val;

        const authorUser = await User.findOne({ _id: author, role: 'author' });
        if (!authorUser)
            return res.status(400).json({ message: 'must be an author to add a book' });

        const catInc = await Category.findByIdAndUpdate(category, {$inc: {numOfBooks: 1}});

        if (!catInc)
            return res.status(404).json({message: 'Category not found'});

        category_updated = true;


        const newBook = await Book.create({
            title,
            category,
            author,
            date_taken,
            isTaken: false
        });

        if (!newBook) {
            await Category.findByIdAndUpdate(category, {$inc: {numOfBooks: -1}});
            return res.status(400).json({message: 'Book not created'});
        }


        return res.status(200).json(newBook);
    } catch (e) {

        if (category_updated) {
            await Category.findByIdAndUpdate(
                req.valid_val.category,
                {$inc: {numOfBooks: -1}}
            );
        }
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function updateBook(req, res) {
    try {
        const id = req.id;
        const update_val = req.valid_val;

        const oldBook = await Book.findById(id).select('category');
        if(!oldBook)
            return res.status(404).json({message: 'Book not found'});


        const categoryChanged = update_val.category &&
            update_val.category.toString() !== oldBook.category.toString();

        if (categoryChanged) {
            const newCatInc = await Category.findByIdAndUpdate(update_val.category, {$inc: {numOfBooks: 1}});
            if (!newCatInc)
                return res.status(404).json({message: 'New category not found'});

            await Category.findByIdAndUpdate(oldBook.category, {$inc: {numOfBooks: -1}});
        }

        const updatedBook = await Book.findByIdAndUpdate(id, update_val, {new: true});

        return res.status(200).json(updatedBook);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function deleteBook(req, res) {
    try {
        const id = req.id;

        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook)
            return res.status(404).json({message: 'Book not found'});


        const category_id = deletedBook.category;
        await Category.findByIdAndUpdate(category_id, {$inc: {numOfBooks: -1}});

        return res.status(200).json(deletedBook);
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function borrowBook(req, res) {
    try {
        const { user_id, book_id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(book_id))
            return res.status(400).json({ message: 'ids not valid' });

        const book = await Book.findById(book_id);
        if (!book){
            return res.status(404).json({message: 'Book not found'});
        }
        if(book.isTaken){
            return res.status(400).json({message: 'Book already taken'});
        }
        const user = await User.findById(user_id);
        if (!user)
            return res.status(404).json({message: 'User not found'});

        const books = user.books;
        if(books.length >= 3){
            return res.status(400).json({message: 'user cant take more books'});
        }
        books.push(book._id);
        book.isTaken = true;
        book.date_taken = new Date();
        book.date_back = null;
        await book.save();
        await user.save();

        return res.status(200).json({message: 'Book borrowed successfully'});

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function returnBook(req, res) {
    try {
        const { user_id, book_id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(book_id))
            return res.status(400).json({ message: 'ids not valid' });

        const user = await User.findById(user_id);
        if (!user)
            return res.status(404).json({message: 'User not found'});

        const hasBook = user.books.some(id => id.equals(book_id));
        if (!hasBook)
            return res.status(400).json({message: 'Book is not borrowed by this user'});

        const book = await Book.findOne({_id: book_id , isTaken: true});
        if (!book)
            return res.status(404).json({ message: 'Book not found or not currently borrowed' });

        user.books.pull(book_id);
        book.isTaken = false;
        book.date_back = new Date();
        await book.save();
        await user.save();

        return res.status(200).json({message: 'Book returned successfully'});

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function getUserOfBook(req, res) {
    try {
        const book_id = req.id;

        const user = await User.findOne({books:book_id}).select('name');
        if (!user)
            return res.status(404).json({message: 'No user is holding this book'});

        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function getAllBooksByCategory(req, res) {
    try {
        const books = await Book.find().populate('category');
        let booksByCategory = new Map();
        books.forEach((book) => {
            let category = book.category.name;
            let value = booksByCategory.get(category) || [];
            value.push(book);
            booksByCategory.set(category,value);
        });

        return res.status(200).json(Object.fromEntries(booksByCategory));

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export {getAllBooks, getBookById, getBooksByCategory, createBook, updateBook , deleteBook, borrowBook, returnBook, getUserOfBook, getAllBooksByCategory};
