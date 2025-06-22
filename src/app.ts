import express, { Application, Request, Response } from 'express';
import { booksRoute } from './app/controllar/books.controllar';

const app: Application = express();

// Middleware
app.use(express.json());
app.use('/api/books', booksRoute)

// If any routes are not matched.
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send("Wellcome to the Library");
})

export default app;