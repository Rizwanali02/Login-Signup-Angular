import express from 'express';
import dotenv from "dotenv"
import connectDB from './database/db.js';
import userRoutes from "./routes/user.routes.js"
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRoutes)

app.get('/', (req, res) => {
    res.send('backend development starting');
});

connectDB().then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server Starting on port ${PORT}`);
    })
}).catch()

