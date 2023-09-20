import express from 'express';
const app = express();
import rateLimitMiddleware from './rateLimitMiddleware';
const port = 3000;


app.use(express.json())
app.use(rateLimitMiddleware);


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
// - Replace ERR_HTTP_HEADERS_SENT with 429
// - Implement a mechanism to track the number of requests made by each client within a minute;
// - Ensure that the middleware correctly handles multiple clients trying to access resources simultaneously;
// - It also involves handling HTTP status codes and timeouts effectively.
