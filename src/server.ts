import express, { Express } from 'express';
import rateLimitMiddleware from './middlewares/rateLimitMiddleware';
import api from './routes/index';
const app: Express = express();


app.use(express.json())

app.use(rateLimitMiddleware);

app.use('/api', api)


const port: number = 3000;
app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});

// TODO:
// - Replace ERR_HTTP_HEADERS_SENT with 429
// - Implement a mechanism to track the number of requests made by each client within a minute;
// - It also involves handling HTTP status codes and timeouts effectively;
// - Nodejs eslint;
