const express = require('express');
const multer = require('multer');
const { getGroceries, postGrocery, patchGroceryQuantity, patchDeleteGrocery } = require('../controllers/groceries.js');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get('/', getGroceries);
router.post('/', postGrocery);
router.patch('/quantity', patchGroceryQuantity);
router.patch('/delete', patchDeleteGrocery);
router.use((request, response) => response.status(404).end());

module.exports = router;