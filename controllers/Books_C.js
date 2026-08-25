import Book from '../module/Books.js';
import Category from '../module/Categories.js';

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

export {getAllBooks, getBookById, getBooksByCategory, createBook, updateBook , deleteBook};
