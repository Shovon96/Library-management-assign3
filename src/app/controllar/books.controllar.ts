import express, { Request, Response } from 'express'
import { z } from 'zod';
import { Books } from '../model/books.model';
import { handleError } from '../utilities/handle.error';

export const booksRoute = express.Router();

// Book fields Zod validation
const booksZodSchema = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    isbn: z.string(),
    description: z.string().optional(),
    copies: z.number(),
    available: z.boolean().optional()
})

// Error Handle
// const handleError = (res: Response, error: any) => {
//     res.status(400).json({
//         success: false,
//         message: error.message || 'Something went wrong',
//         error: error
//     });
// };


// Create a book
booksRoute.post('/', async (req: Request, res: Response) => {
    try {
        // const body = req.body;
        const body = await booksZodSchema.parseAsync(req.body);
        const book = await Books.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })
    } catch (error: any) {
        console.log("Error from book post route", error);
        handleError(res, error)
    }
})

// Get all the books
booksRoute.get('/', async (req: Request, res: Response) => {
    try {

        // Queries
        const filter = req.query.filter as string;
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sort = (req.query.sort as string) === 'asc' ? 1 : -1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Filter
        const query: any = {};
        if (filter) {
            query.genre = filter.toUpperCase();
        }

        // sort and limit
        const books = await Books.find(query)
            .sort({ [sortBy]: sort })
            .limit(limit);

        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        })
    } catch (error: any) {
        console.log("Error from get all books route", error);
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
        console.log("Error from get specific book by ID route", error);
        handleError(res, error)
    }
})


// Update a Specific book any data using by ID

// For 'PATCH' route: update any field using by partial()
const updateBookZodSchema = booksZodSchema.partial();
booksRoute.patch('/:bookId', async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const updatedBody = await updateBookZodSchema.parseAsync(req.body);
        const copiesNumber = updatedBody.copies;

        if (copiesNumber === undefined || copiesNumber > 0) {
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
        console.log("Error from update specific book by ID route", error);
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
        console.log("Error from delete a specific book route", error);
        handleError(res, error)
    }
})