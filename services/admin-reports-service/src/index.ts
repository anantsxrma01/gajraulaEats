import express from 'express';
import { generateReport } from './reportGenerator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/reports', async (req, res) => {
    try {
        const report = await generateReport();
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
});

app.listen(PORT, () => {
    console.log(`Admin & Reports Service running on port ${PORT}`);
});