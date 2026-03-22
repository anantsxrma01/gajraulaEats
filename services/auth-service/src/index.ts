import express from 'express';
import bodyParser from 'body-parser';
import { createUser, loginUser, verifyToken } from './controllers/authController';
import { authenticate } from './middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/register', createUser);
app.post('/login', loginUser);
app.get('/verify', authenticate, verifyToken);

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});