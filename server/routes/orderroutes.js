const router = require('express').Router();

const isAdmin = require('../helpers/check-admin');

const OrderController = require('../controllers/OrderController');

router.post('/neworder', OrderController.neworder);
router.get('/getAllOrders', isAdmin, OrderController.getAllOrders);
router.get('/getOrderItemsByOrderId/:id', isAdmin, OrderController.getOrderItemsByOrderId);
router.put('/putOrder/:id', isAdmin, OrderController.putOrder);
router.get('/returnAddress/:number', OrderController.returnAddress);
router.post('/prizeDraw', isAdmin, OrderController.prizeDraw);

module.exports = router;
