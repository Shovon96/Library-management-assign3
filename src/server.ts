import { Server } from 'http';
import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';

dotenv.config()

let server: Server;
const PORT = process.env.PORT || 5000

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        server = app.listen(PORT, () => {
            console.log(`App is listening port on ${PORT}`);
        });
    } catch (error) {
        console.log('Failed, connect to MongoDB', error);
    }
}

main()