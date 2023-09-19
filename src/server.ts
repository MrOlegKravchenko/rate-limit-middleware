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
app.get('/api/user', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});

// TODO:
// 0) Use User Constructor to build in methods to validate each User's data from inside;
//
// 1) Way to track 60 (interval) seconds:
// - wait until 100 (maxRequests) request;
// - check the diff between last request's receive time and request's receive time 100 before;
//
// 2) When limit triggered way to hold the requests to come:
// Need onHold/isActive field which waits 60s before turn off.
