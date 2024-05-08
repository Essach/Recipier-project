const express = require('express');
const multer = require('multer');
const { getRecipes, postRecipe, patchDeleteRecipe } = require('../controllers/recipes.js');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get('/', getRecipes);
router.post('/', upload.any(), postRecipe);
router.patch('/delete', patchDeleteRecipe);
router.use((request, response) => response.status(404).end());

module.exports = router;