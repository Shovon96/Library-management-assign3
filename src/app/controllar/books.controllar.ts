import express, { Request, Response } from 'express'
import { Books } from '../module/books.module';

export const booksRoute = express.Router();

// Error Handle
const handleError = (res: Response, error: any) => {
    res.status(400).json({
        success: false,
        message: error.message || 'Something went wrong',
        error: error
    });
};

// Create a book
booksRoute.post('/', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const book = await Books.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })
    } catch (error: any) {
        console.log(error, "Error from book post route");
        handleError(res, error)
    }
})

// Get all the books
booksRoute.get('/', async (req: Request, res: Response) => {
    try {
        const books = await Books.find()
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        })
    } catch (error: any) {
        console.log(error, "Error from get all books route");
        handleError(res, error)
    }
})

// Get a Specific book using by ID
booksRoute.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const book = await Books.findById(bookId);

        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        })
    } catch (error: any) {
        console.log(error, "Error from get specific book by ID route");
        handleError(res, error)
    }
})


// Update a Specific book any data using by ID
booksRoute.patch('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const copiesNumber = updatedBody.copies;

        if (copiesNumber > 0) {
            const updatedBook = await Books.findByIdAndUpdate(bookId, updatedBody, { new: true })
            res.status(201).json({
                success: true,
                message: "Book updated successfully",
                data: updatedBook
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Not allowed the negative numbers",
                data: copiesNumber
            })
        }

    } catch (error: any) {
        console.log(error, "Error from update specific book by ID route");
        handleError(res, error)
    }
})


// Delete a specific book using by ID from the database
booksRoute.delete('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const deleteBook = await Books.findByIdAndDelete(bookId);

        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error: any) {
        console.log(error, "Error from delete a specific book route");
        handleError(res, error)
    }
})