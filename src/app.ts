import express, { Application, Request, Response } from 'express';
import { booksRoute } from './app/controllar/books.controllar';
import { borrowRoute } from './app/controllar/borrow.controllar';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', booksRoute);
app.use('/api/borrow', borrowRoute);

app.get('/', (req: Request, res: Response) => {
    res.send("Wellcome to the Library Management Server.");
})

// If any routes are not matched.
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});

export default app;