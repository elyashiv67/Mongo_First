import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../module/Users.js';
import Category from '../module/Categories.js';
import Book from '../module/Books.js';

dotenv.config();

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categoriesData = [
    { name: 'Fantasy' },
    { name: 'Adventure' },
    { name: 'Science Fiction' },
    { name: 'Romance' },
    { name: 'Classic Literature' },
    { name: 'Children' },
];

// role: 'author' — Book.author must reference a user with this role
const authorsData = [
    { name: 'J.K. Rowling',    phone: '0500000001', email: 'jk.rowling@books.com',    address: 'Edinburgh, Scotland' },
    { name: 'J.R.R. Tolkien',  phone: '0500000002', email: 'jrr.tolkien@books.com',   address: 'Oxford, England' },
    { name: 'Jane Austen',     phone: '0500000003', email: 'jane.austen@books.com',   address: 'Steventon, Hampshire' },
    { name: 'Diana Gabaldon',  phone: '0500000004', email: 'diana.gabaldon@books.com', address: 'Scottsdale, Arizona' },
    { name: 'Nicholas Sparks', phone: '0500000005', email: 'n.sparks@books.com',      address: 'New Bern, North Carolina' },
    { name: 'Jojo Moyes',      phone: '0500000006', email: 'jojo.moyes@books.com',    address: 'Essex, England' },
    { name: 'Eric Carle',      phone: '0500000007', email: 'eric.carle@books.com',    address: 'Syracuse, New York' },
    { name: 'Maurice Sendak',  phone: '0500000008', email: 'm.sendak@books.com',      address: 'Brooklyn, New York' },
    { name: 'Dr. Seuss',       phone: '0500000009', email: 'dr.seuss@books.com',      address: 'Springfield, Massachusetts' },
    { name: 'Roald Dahl',      phone: '0500000010', email: 'roald.dahl@books.com',    address: 'Llandaff, Wales' },
    { name: 'Jules Verne',     phone: '0500000011', email: 'jules.verne@books.com',   address: 'Nantes, France' },
];

// role: 'user' — regular library members
const usersData = [
    { name: 'Alice Cohen',   phone: '0521111111', email: 'alice@library.com', address: 'Tel Aviv' },
    { name: 'Bob Levi',      phone: '0522222222', email: 'bob@library.com',   address: 'Jerusalem' },
    { name: 'Carol Mizrahi', phone: '0523333333', email: 'carol@library.com', address: 'Haifa' },
    { name: 'David Peretz',  phone: '0524444444', email: 'david@library.com', address: 'Beer Sheva' },
];

// role: 'admin'
const adminsData = [
    { name: 'Library Admin', phone: '0539999999', email: 'admin@library.com', address: 'Kinneret College' },
];

// author / category referenced by name, resolved to ObjectIds below
const booksData = [
    // Harry Potter — J.K. Rowling
    { title: "Harry Potter and the Philosopher's Stone",  author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Chamber of Secrets',   author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Prisoner of Azkaban',  author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Goblet of Fire',       author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Order of the Phoenix', author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Half-Blood Prince',    author: 'J.K. Rowling', category: 'Fantasy' },
    { title: 'Harry Potter and the Deathly Hallows',      author: 'J.K. Rowling', category: 'Fantasy' },

    // Lord of the Rings / Middle-earth — J.R.R. Tolkien
    { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', category: 'Fantasy' },
    { title: 'The Two Towers',             author: 'J.R.R. Tolkien', category: 'Fantasy' },
    { title: 'The Return of the King',     author: 'J.R.R. Tolkien', category: 'Fantasy' },
    { title: 'The Silmarillion',           author: 'J.R.R. Tolkien', category: 'Fantasy' },
    { title: 'The Hobbit',                 author: 'J.R.R. Tolkien', category: 'Adventure' },

    // Adventure / Science Fiction — Jules Verne
    { title: 'Journey to the Center of the Earth',       author: 'Jules Verne', category: 'Adventure' },
    { title: 'Around the World in Eighty Days',          author: 'Jules Verne', category: 'Adventure' },
    { title: 'Twenty Thousand Leagues Under the Sea',    author: 'Jules Verne', category: 'Science Fiction' },

    // Romance
    { title: 'Sense and Sensibility', author: 'Jane Austen',     category: 'Romance' },
    { title: 'Emma',                  author: 'Jane Austen',     category: 'Romance' },
    { title: 'Outlander',             author: 'Diana Gabaldon',  category: 'Romance' },
    { title: 'The Notebook',          author: 'Nicholas Sparks', category: 'Romance' },
    { title: 'A Walk to Remember',    author: 'Nicholas Sparks', category: 'Romance' },
    { title: 'Me Before You',         author: 'Jojo Moyes',      category: 'Romance' },

    // Classic Literature
    { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic Literature' },
    { title: 'Persuasion',          author: 'Jane Austen', category: 'Classic Literature' },

    // Children
    { title: 'The Very Hungry Caterpillar',              author: 'Eric Carle',     category: 'Children' },
    { title: 'Brown Bear, Brown Bear, What Do You See?', author: 'Eric Carle',     category: 'Children' },
    { title: 'Where the Wild Things Are',                author: 'Maurice Sendak', category: 'Children' },
    { title: 'In the Night Kitchen',                     author: 'Maurice Sendak', category: 'Children' },
    { title: 'The Cat in the Hat',                       author: 'Dr. Seuss',      category: 'Children' },
    { title: 'Green Eggs and Ham',                       author: 'Dr. Seuss',      category: 'Children' },
    { title: "Oh, the Places You'll Go!",                author: 'Dr. Seuss',      category: 'Children' },
    { title: 'Matilda',                                  author: 'Roald Dahl',     category: 'Children' },
    { title: 'Charlie and the Chocolate Factory',        author: 'Roald Dahl',     category: 'Children' },
    { title: 'The BFG',                                  author: 'Roald Dahl',     category: 'Children' },
];

/* ------------------------------------------------------------------ */
/*  Seed routine                                                       */
/* ------------------------------------------------------------------ */

async function seed() {
    if (!process.env.DB) throw new Error('DB connection string missing (check .env)');

    await mongoose.connect(process.env.DB);
    console.log(`Connected to ${mongoose.connection.name} for seeding...`);

    // wipe existing data so the script is repeatable
    await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Book.deleteMany({}),
    ]);
    console.log('Cleared users, categories and books.');

    // categories
    const categories = await Category.insertMany(categoriesData);
    const catId = new Map(categories.map(c => [c.name, c._id]));
    console.log(`Inserted ${categories.length} categories.`);

    // users — one of every role
    const authors = await User.insertMany(authorsData.map(u => ({ ...u, role: 'author' })));
    const members = await User.insertMany(usersData.map(u => ({ ...u, role: 'user' })));
    const admins  = await User.insertMany(adminsData.map(u => ({ ...u, role: 'admin' })));
    const authorId = new Map(authors.map(a => [a.name, a._id]));
    console.log(`Inserted ${authors.length} authors, ${members.length} users, ${admins.length} admin.`);

    // books
    const books = await Book.insertMany(booksData.map(b => ({
        title: b.title,
        author: authorId.get(b.author),
        category: catId.get(b.category),
        isTaken: false,
        date_back: null,
    })));
    console.log(`Inserted ${books.length} books.`);

    // simulate a couple of active loans so borrow/return have data to work with
    const borrower = members[0];
    const loaned = books.slice(0, 2);
    for (const book of loaned) {
        book.isTaken = true;
        book.date_taken = new Date();
        await book.save();
        borrower.books.push(book._id);
    }
    await borrower.save();
    console.log(`${borrower.name} has borrowed: ${loaned.map(b => b.title).join(', ')}`);

    // sync each category's numOfBooks with reality
    for (const cat of categories) {
        cat.numOfBooks = await Book.countDocuments({ category: cat._id });
        await cat.save();
    }
    console.log('Synced category book counts.');

    await mongoose.disconnect();
    console.log('Seeding complete. Disconnected.');
}

seed().catch(async (err) => {
    console.error('Seeding failed:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
