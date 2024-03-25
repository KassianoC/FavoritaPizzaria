const router = require('express').Router();

const FoodController = require('../controllers/FoodController');
const isAdmin = require('../helpers/check-admin');
const { imageUpload } = require('../helpers/image-upload');

router.post('/newfood', isAdmin, imageUpload.single('image'), FoodController.newFood);
router.get('/getAllFood', FoodController.getAllFood);
router.patch('/editFood/:code', isAdmin, imageUpload.single('image'), FoodController.editFood);
router.get('/foodCode/:name', FoodController.foodCode);
router.delete('/deletefood/:name', isAdmin, FoodController.deleteFood);

module.exports = router;
