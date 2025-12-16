import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notesRoutes from './routes/notesRoutes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Allow parsing JSON bodies

app.use('/api/ai', aiRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/notes',notesRoutes);

app.listen(port, () => {
    console.log(`Synapse Notes Backend running on http://localhost:${port}`);
});