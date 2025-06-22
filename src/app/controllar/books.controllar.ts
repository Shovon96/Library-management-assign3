import express, { Request, Response } from 'express'
import { Books } from '../module/books.module';

export const booksRoute = express.Router();

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
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
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
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
})

// Get Specific a book using by ID
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
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
})