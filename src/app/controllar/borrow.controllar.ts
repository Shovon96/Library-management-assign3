import express, { Request, Response } from 'express'
import { z } from 'zod';
import { Books } from '../model/books.model';
import { Borrow } from '../model/borrow.model';
import { handleError } from '../utilities/handle.error';

export const borrowRoute = express.Router();

// Borrow fields zod validation
const borrowZodSchema = z.object({
    book: z.string(),
    quantity: z.number(),
    dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid due date format"
    })
})

// POST a borrow
borrowRoute.post('/', async (req: Request, res: Response) => {

    try {
        const { book, quantity, dueDate } = await borrowZodSchema.parseAsync(req.body);;

        // Find the book
        const findBook: any = await Books.findById(book);
        if (!findBook) {
            res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if enough copies are available
        if (findBook.copies < quantity) {
            res.status(400).json({
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

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowRecord
        });

    } catch (error: any) {
        console.log("Error from borrow post route:", error);
        handleError(res, error)
    }
});


// Get all borrow with quantity and name
borrowRoute.get('/', async (req: Request, res: Response) => {
    try {
        const borrow = await Borrow.aggregate([
            {
                // step-1
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            // step-2
            {
                $group: {
                    _id: "$book.title",
                    isbn: { $first: "$book.isbn" },
                    totalQuantity: { $sum: "$quantity" },
                }
            },
            // step-3
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$_id",
                        isbn: "$isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);

        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrow
        });


    } catch (error: any) {
        console.log("Error from borrow get route:", error);
        handleError(res, error)
    }
})