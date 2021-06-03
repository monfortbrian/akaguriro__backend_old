import express from 'express'
import * as productController from '../controller/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()
const {
 getProducts,
 createProduct,
 getProductById,
 deleteProduct,
 updateProduct,
 createProductReview,
 deleteAllReviews,
 getTopProducts,
} = productController

router.route('/').get(getProducts).post(protect, admin, createProduct)
router
 .route('/:id')
 .get(getProductById)
 .delete(protect, admin, deleteProduct)
 .put(protect, admin, updateProduct)

router.get('/top', getTopProducts)

router.delete('/:id/erasereviews', protect, admin, deleteAllReviews)
router.patch('/:id/review', protect, createProductReview)

export default router
