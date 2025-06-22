import express, { Request, Response } from 'express'
import { Books } from '../module/books.module';

export const booksRoute = express.Router();

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
