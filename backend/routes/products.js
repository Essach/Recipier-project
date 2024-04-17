const express = require('express');
const { getProducts, getProduct, getProductReviews } = require('../controllers/products.js');

const router = express.Router();

router.get('/:id', getProduct);
router.get('/', getProducts);
router.get('/:id', getProductReviews);
router.use((request, response) => response.status(404).end());

module.exports = router