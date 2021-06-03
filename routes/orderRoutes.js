import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
 createOrder,
 getOrders,
 getSingleOrder,
 updateOrderPaid,
 orderIsDelivered,
 getMyOrders,
} from '../controller/orderController.js'

const router = express.Router()

router.route('/').get(protect, admin, getOrders).post(protect, createOrder)
router.route('/:id').get(protect, getSingleOrder)

router.post('/myorders', protect, getMyOrders)
router.patch('/ispaid/:id', protect, admin, updateOrderPaid)
router.patch('/isdelivered/:id', protect, admin, orderIsDelivered)
export default router
