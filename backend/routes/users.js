const express = require('express');
const multer = require('multer');
const { postUserCreate, postUserLogin, postUserSellProduct, postUserEditProduct, postUserDeleteProduct, postReview, patchUserOrder, patchUserFavorite, patchUserSeller, patchUserPassword, getUserName, patchSendMessage } = require('../controllers/users.js');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({storage: storage});

router.post('/create', postUserCreate);
router.post('/login', postUserLogin);
router.post('/productAdd', upload.any(), postUserSellProduct);
router.post('/productEdit', upload.any(), postUserEditProduct);
router.post('/productDelete', upload.any(), postUserDeleteProduct);
router.post('/review', postReview);
router.patch('/orders', patchUserOrder);
router.patch('/favorites', patchUserFavorite);
router.patch('/seller', patchUserSeller);
router.patch('/password', patchUserPassword);
router.patch('/message', patchSendMessage);
router.get('/:id', getUserName);
router.use((request, response) => response.status(404).end());

module.exports = router;