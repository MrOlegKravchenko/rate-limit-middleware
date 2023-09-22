import express from 'express';
import rateLimitMiddleware from './middlewares/rateLimitMiddleware';
import api from './routes/index';
const app = express();


app
    .use(express.json())
    .use(rateLimitMiddleware)
    .use('/api', api)


const port: number = 3000;

export default app.listen(port, () => {
    return console.log(`Server is running on port ${port}`);
});
