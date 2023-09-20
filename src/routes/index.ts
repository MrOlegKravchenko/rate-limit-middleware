import express from 'express';

const router = express.Router();

router
    .get('/products', (_req, res) => {
        res.status(200).send('List of products');
    })
    .get('/taxes', (_req, res) => {
        res.status(200).send('List of taxes');
    });

export default router;