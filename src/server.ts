import express from 'express';
const app = express();
import rateLimitMiddleware from './rateLimitMiddleware';
const port = 3000;


app.use(express.json())
app.use((req, res, next) => {
    const userId: string | string[] = req.headers['user-id'];

    rateLimitMiddleware({ userId, maxRequests: 100, interval: 60 });
    next();
});

app.get('/api/products', (_req, res): void => {
    res.status(200).send('List of products');
});
app.get('/api/taxes', (_req, res): void => {
    res.status(200).send('List of taxes');
});

app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});

// TODO:
// When limit triggered way to hold the requests to come:
// Need onHold/isActive field which waits 60s before turn off.
