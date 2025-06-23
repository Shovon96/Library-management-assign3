import express, { Request, Response } from 'express'
import { Books } from '../model/books.model';
import { Borrow } from '../model/borrow.model';

export const borrowRoute = express.Router()

// POST a borrow
borrowRoute.post('/', async (req: Request, res: Response) => {

    try {
        const { book, quantity, dueDate } = req.body;

        // Find the book
        const findBook = await Books.findById(book);
        if (!findBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if enough copies are available
        if (findBook.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough book copies available'
            });
        }

        // Reduce the book copies
        findBook.copies -= quantity;
        if (findBook.copies === 0) {
            findBook.available = false;
        }
        // Save updated book info
        await findBook.save();

        // Create new borrow record
        const borrowRecord = await Borrow.create({ book, quantity, dueDate });

        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowRecord
        });

    } catch (error: any) {
        console.log("Error from borrow post route:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
});