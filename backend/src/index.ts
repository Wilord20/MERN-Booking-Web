import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_DB_CONNEX as string).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error.message);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/test', async (req: Request, res: Response) => {
  res.json('Hello World!');
});

app.listen(7000, () => {
    console.log('Server is running on port 7000');
});