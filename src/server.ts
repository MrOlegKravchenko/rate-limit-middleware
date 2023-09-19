import express from 'express';
const app = express();
import rateLimitMiddleware from './rateLimitMiddleware';
const port = 3000;

app.use(express.json())
app.use((req, res, next) => {
    const userId = req.headers['user-id'];

    rateLimitMiddleware({ userId, maxRequests: 100, interval: 60 });
    next();
});
app.get('/api/user', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});
