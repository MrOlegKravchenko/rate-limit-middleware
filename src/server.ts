import express from 'express';
const app = express();
import rateLimitMiddleware from './middlewares/rateLimitMiddleware';
import api from './routes/index';
const port = 3000;


app.use(express.json())

app.use(rateLimitMiddleware);

app.use('/api', api)


app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});

// TODO:
// - Replace ERR_HTTP_HEADERS_SENT with 429
// - Implement a mechanism to track the number of requests made by each client within a minute;
// - Ensure that the middleware correctly handles multiple clients trying to access resources simultaneously;
// - It also involves handling HTTP status codes and timeouts effectively.
