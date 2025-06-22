import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';

let server: Server;

const PORT = 5000

async function main() {
    try {
        await mongoose.connect('mongodb+srv://library-management:Q3p6IYUh3Umb0bBe@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        server = app.listen(PORT, () => {
            console.log(`App is listening port on ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main()