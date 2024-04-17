const express = require('express');
const { postPayment, getPaymentInfo } = require('../controllers/payments.js');

const router = express.Router();

router.post('/', postPayment);
router.get('/:id', getPaymentInfo);
router.use((request, response) => response.status(404).end());

module.exports = router