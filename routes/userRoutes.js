import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
 authUser,
 logout,
 registerUser,
 getUserProfile,
 updateUserProfile,
 getUsers,
 deleteUser,
 getUserById,
 updateUser,
} from '../controller/userController.js'
const router = express.Router()

router
 .route('/:id')
 .get(protect, admin, getUserById)
 .put(protect, protect, updateUser)
 .delete(protect, admin, deleteUser)
router.post('/auth', authUser)
router.post('/logout', logout)
router.post('/register', registerUser)
router.get('/', protect, admin, getUsers)
router.get('/profile/me', protect, getUserProfile)
router.patch('/profile/:id', protect, admin, updateUserProfile)
export default router
