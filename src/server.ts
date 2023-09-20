import express from 'express';
import rateLimitMiddleware from './middlewares/rateLimitMiddleware';
import api from './routes/index';
const app = express();


app.use(express.json())

app.use(rateLimitMiddleware);

app.use('/api', api)


const port: number = 3000;
app.listen(port, () => {
    return console.log(`'Server is running on port ${port}`);
});

// TODO:
// - Replace ERR_HTTP_HEADERS_SENT with 429
// - Nodejs eslint;
