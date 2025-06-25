### Server Link URL: https://library-management-liard-six.vercel.app

# Library Management API

This is a Node.js, Express, TypeScript-based RESTful API for managing books and borrow operations in a digital library. It uses MongoDB with Mongoose, and includes Zod validation, custom error handling, and Vercel deployment.

---

## Features

- Book CRUD (Create, Read, Update, Delete)
- Borrow system with inventory checks
- Zod-based request validation
- Mongoose Middleware (`pre`, `post`)
- Aggregation for borrow reports
- Error formatting
- Filtering, Sorting, Limiting on get `/api/books`
- Server deploy in vercel.

---

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **Mongoose (MongoDB)**
- **Zod** (for validation)
- **Vercel** (for deployment)

---

## Books Routes

### 1. Create a Book: `POST /api/books`

- Creates a new book entry in library.
- Validates the request body using a `Zod` schema.
- Through the error if any requirment are not fulfill.
- Required request fields: `title`, `author`, `genre`, `isbn`, `copies`
- Optional request fields: `description`, `available`

---

### 2. Get all Books: `GET /api/books`

- Retrieves all books from the database.
- Supports query-based `filtering` by genre.
- Allows `sorting` by specific fields in `ascending` or `descending` order.
- `Limits` the number of returned books based on the provided limit.

--- 

### 3. Get Signle Book: `Get /api/books/:bookId`

Description: Fetch a book by its ID.
Response:
Returns book details if found.
Shows an error if not found.

---

### 4. Update Signle Book data: `PATCH /api/books/:bookId`

- `Updates` a specific book by using `Id` in book any fields.
- Validates the updated data using `Zod` before applying changes.
- Prevents updating if the number of `copies` is less than or equal to zero.
- Returns updated book data if successful.

--- 

### 5. Delete a Book: `DELETE /api/books/:bookId`

- Delete a book using by ID.
- Returns a success message if deleted.
- Shows error if book not found.

---

## Borrow Routes

### 1. Create a Borrow: `POST /api/borrow`

- Creates a borrow record for a specific book.

- Validates the request using a `Zod` schema.

- Ensures sufficient book copies are available before borrowing.

- Automatically reduces the book's available copies.

- If copies become zero, sets the book’s availability to false.

---

### 2. Get Borrow Summary: `GET /api/borrow`

- Returns a summary of all borrowed books.

- Uses MongoDB aggregation to group borrowed quantities by book title.

- Joins book details via `$lookup` and displays total quantity borrowed per book.

---

## ⚠️ Fallback Route

* (Any unmatched route)
- Catches all undefined routes.
- Returns a 404 response with a standard JSON error message.

---

## How to Use: 

1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Configure environment variables in `.env` file
4. Run the server
```bash
npm run dev
```
5. Use Postman or any REST client to test the API endpoints

---

# Thank You. 