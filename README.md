# Library Server

A small REST API for managing a library: **users**, **book categories**, and **books**,
including a borrow / return flow.

> ℹ️ **This is my first time building a MongoDB server and database.**
> The project is a learning exercise, so some things are intentionally simple
> (see [Known limitations](#known-limitations)). Feedback welcome.

---

## Tech stack

| Purpose            | Choice                     |
| ------------------ | -------------------------- |
| Runtime            | Node.js (ES modules)       |
| Web framework      | Express 5                  |
| Database           | MongoDB (MongoDB Atlas)    |
| ODM                | Mongoose 9                 |
| Config             | dotenv                     |
| HTTP logging       | morgan                     |
| Dev reload         | nodemon                    |

---

## Project structure

```
library_server/
├── index.js              # app entry: express setup + DB connect + listen
├── services/
│   ├── mongoDB.js         # mongoose connection helper
│   └── seed.js            # wipes + reseeds the DB with sample data
├── module/               # Mongoose schemas / models
│   ├── Users.js
│   ├── Categories.js
│   └── Books.js
├── routes/               # Express routers (URL -> controller wiring)
│   ├── Main_R.js          # mounts /users, /cat, /books
│   ├── Users_R.js
│   ├── Caterories_R.js
│   └── Books_R.js
├── controllers/          # request handlers (the actual logic)
│   ├── Users_C.js
│   ├── Categories_C.js
│   └── Books_C.js
└── middleware/           # validation + shared checks
    ├── global_MID.js     # ValidId: checks :id is a valid ObjectId
    ├── Users_MID.js
    ├── Categories_MID.js
    └── Books_MID.js
```

**Request flow:** `index.js` → `Main_R` → resource router → validation middleware → controller → Mongoose model → MongoDB.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (it is git-ignored):

```env
HOST=localhost
PORT=3000
DB=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database-name>
```

- `HOST` / `PORT` – where the server listens.
- `DB` – full MongoDB connection string. The database name is the part after the last `/`.
- Never commit real values. `.env` is git-ignored; use your own cluster credentials.

### 3. Seed sample data (optional but recommended)

```bash
npm run seed
```

This **deletes** all users, categories and books, then inserts a fresh set
(see [Seed data](#seed-data)). Run it any time you want to reset to a known state.

### 4. Run the server

```bash
npm start        # nodemon index.js
```

You should see:

```
MongoDB Connected ...
Server is running on port 3000 ✅
http://localhost:3000
```

---

## Data models

### User (`module/Users.js`)

| Field     | Type       | Notes                                             |
| --------- | ---------- | ------------------------------------------------- |
| `name`    | String     | required                                         |
| `phone`   | String     | required, unique, max 10 chars                    |
| `email`   | String     | required, unique                                 |
| `address` | String     | required                                         |
| `books`   | [ObjectId] | refs `Book` – books this user currently holds     |
| `role`    | String     | `admin` \| `user` \| `author` (default `user`)    |

`timestamps: true` adds `createdAt` / `updatedAt`.

### Category (`module/Categories.js`)

| Field        | Type   | Notes                                    |
| ------------ | ------ | ---------------------------------------- |
| `name`       | String | required, unique                        |
| `numOfBooks` | Number | count of books in this category         |

`numOfBooks` is kept in sync by the book controllers (`$inc` on create / delete / move).

### Book (`module/Books.js`)

| Field        | Type     | Notes                                                     |
| ------------ | -------- | -------------------------------------------------------- |
| `title`      | String   | required                                                |
| `author`     | ObjectId | refs `User` – must be a user whose `role` is `author`    |
| `category`   | ObjectId | refs `Category`, required                                |
| `date_taken` | Date     | when it was last borrowed (default: now)                 |
| `date_back`  | Date     | when it was last returned (default: null)                |
| `isTaken`    | Boolean  | `true` while borrowed (default: false)                   |

---

## API reference

Base URL: `http://localhost:3000`

### Users – `/users`

| Method | Path             | Description                          |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/users`         | list all users                      |
| GET    | `/users/authors` | list users with role `author`       |
| GET    | `/users/:id`     | get one user                        |
| POST   | `/users/add`     | create a user                       |
| PATCH  | `/users/:id`     | update a user                       |
| DELETE | `/users/:id`     | delete a user                       |

**Create body example**

```json
{
  "name": "Alice Cohen",
  "phone": "0521111111",
  "email": "alice@library.com",
  "address": "Tel Aviv",
  "role": "user"
}
```

### Categories – `/cat`

| Method | Path        | Description                                              |
| ------ | ----------- | ------------------------------------------------------- |
| GET    | `/cat`      | list all categories                                   |
| GET    | `/cat/:id`  | get one category                                       |
| POST   | `/cat/add`  | create a category                                     |
| PATCH  | `/cat/:id`  | update a category                                     |
| DELETE | `/cat/:id`  | delete – **blocked** if any book is still assigned     |

**Create body example**

```json
{ "name": "Fantasy", "numOfBooks": 0 }
```

### Books – `/books`

| Method | Path                  | Description                                        |
| ------ | --------------------- | ------------------------------------------------- |
| GET    | `/books`              | list all books                                   |
| GET    | `/books/byCategory`   | all books grouped by category name               |
| GET    | `/books/byCategory/:id` | books in one category (`:id` = category id)     |
| GET    | `/books/takenBy/:id`  | which user currently holds this book (`:id` = book id) |
| GET    | `/books/:id`          | get one book                                     |
| POST   | `/books/create`       | create a book (`author` must be an author user)   |
| POST   | `/books/borrow`       | borrow a book                                    |
| POST   | `/books/return`       | return a book                                    |
| PATCH  | `/books/:id`          | update a book                                    |
| DELETE | `/books/:id`          | delete a book (decrements its category count)     |

**Create body example**

```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "author": "<author user _id>",
  "category": "<category _id>",
  "date_taken": "2026-09-01"
}
```

**Borrow / return body**

```json
{ "user_id": "<user _id>", "book_id": "<book _id>" }
```

---

## Borrow / return flow

**Borrow** (`POST /books/borrow`):

1. Validate `user_id` and `book_id` are real ObjectIds.
2. Load the book – 404 if missing, 400 if `isTaken` is already `true`.
3. Load the user – 404 if missing.
4. Reject if the user already holds 3 books.
5. Push the book id into `user.books`, set `isTaken = true`, `date_taken = now`,
   `date_back = null`, save both.

**Return** (`POST /books/return`):

1. Validate ids.
2. Load the user, confirm the book id is in `user.books`.
3. Load the book, confirm it is currently `isTaken`.
4. Pull the book id out of `user.books`, set `isTaken = false`, `date_back = now`, save both.

---

## Seed data

`npm run seed` inserts:

- **Users – every role**
  - 11 **authors**: J.K. Rowling, J.R.R. Tolkien, Jane Austen, Diana Gabaldon,
    Nicholas Sparks, Jojo Moyes, Eric Carle, Maurice Sendak, Dr. Seuss, Roald Dahl, Jules Verne
  - 4 **users** and 1 **admin**
- **6 categories**: Fantasy, Adventure, Science Fiction, Romance, Classic Literature, Children
- **33 books**: the 7 Harry Potter books, Tolkien's Middle-earth books,
  romance titles, children's books, and a few Jules Verne adventures
- **2 active loans** so `/books/return` and `/books/takenBy/:id` have data to work with

Category `numOfBooks` is recalculated from the actual book counts at the end.

---

## Known limitations

Things I know are missing / rough, kept out of scope for a first version:

- **No authentication or authorization.** Every endpoint is open; `role` is stored
  but never enforced (except that a book's `author` must be an author user).
- **No passwords** on the User model.
- **Not transactional.** Borrow / return / create do several `save()` calls in a row;
  a failure partway through can leave the data half-updated. A real version would use
  a MongoDB transaction (needs a replica set).
- **Race conditions.** Two simultaneous borrow requests for the same book can both pass
  the `isTaken` check before either saves.
- **Inconsistent route naming**: `/books/create`, `/cat/add`, `/users/add` vs plain REST.
- **No pagination** on list endpoints.
- **No automated tests.**

---

## Notes to self (first Mongo project — what I learned)

- **Mongoose model = collection.** `mongoose.model('Book', schema)` maps to the
  lowercased, pluralised `books` collection.
- **`ref` + `populate()`** turn a stored ObjectId into the full related document.
  `Book.find().populate('category')` replaces the category id with the category object.
- **`required: true` on a field** means "must be present when saving" – setting it to
  `null` later will fail validation (hit this on `date_taken` during return).
- **A `ref` does not guarantee the target still exists.** Deleting a Category can leave
  books pointing at nothing, so `deleteCategory` now blocks when books are assigned.
- **Comparing ObjectIds:** `id1 === id2` is always false; use `id1.equals(id2)`.
- **`Map` does not `JSON.stringify`** – it serialises to `{}`. Use a plain object or
  `Object.fromEntries(map)` before `res.json(...)`.
- **Query on an array field** with a scalar (`User.findOne({ books: bookId })`) matches
  "array contains this value" – `{ books: [bookId] }` matches an *exact* one-element array.
- **`express.json()`** must be registered before any route reads `req.body`.
- **Keep secrets in `.env`** and git-ignore it; the connection string is not in the repo.
