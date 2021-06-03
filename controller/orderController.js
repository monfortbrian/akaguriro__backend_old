import mongoose from 'mongoose'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

// @desc create a order
// @route /api/v1/orders
// @access private

export const createOrder = asyncHandler(async (req, res, next) => {
 req.body.user = req.user._id
 const order = new Order(req.body)

 order
  .save()
  .then((result) => {
   return res.status(200).json({ success: true, data: result })
  })
  .catch((err) => {
   res.status(500)
   throw new Error('order not created')
  })
})
// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
 const pageSize = 10
 const page = Number(req.query.pageNumber) || 1

 const keyword = req.query.keyword
  ? {
     name: {
      $regex: req.query.keyword,
      $options: 'i',
     },
    }
  : {}

 const count = await Order.countDocuments({ ...keyword })
 const orders = await Order.find({ ...keyword })
  .limit(pageSize)
  .skip(pageSize * (page - 1))

 res.json({
  orders,
  page,
  count: orders.length,
  pages: Math.ceil(count / pageSize),
 })
})
// @desc   GET single order
// @route /api/v1/orders/:id
// @access private
export const getSingleOrder = asyncHandler(async (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  res.status(404)
  throw new Error(`invalid id`)
 }

 Order.findById(req.params.id)
  .then((result) => res.status(200).json({ success: true, data: result }))
  .catch((err) => next(new ErrorResponse(err.message, 500)))
})

// @desc  mention the order is paid
// @route /api/v1/orders
// @access private/admin
export const updateOrderPaid = asyncHandler(async (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return next(new ErrorResponse('invalid id', 404))
 }

 const order = await Order.findByIdAndUpdate(
  req.params.id,
  { isPaid: true },
  { new: true, runValidators: true }
 )
 order && res.status(200).json({ success: true, data: order })
})

// @desc  mention the order is paid
// @route /api/v1/orders
// @access private/admin

export const orderIsDelivered = asyncHandler(async (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return next(new ErrorResponse('invalid id', 404))
 }
 const order = await Order.findByIdAndUpdate(
  { _id: req.params.id },
  { isDelivered: true },
  { new: true, runValidators: true }
 )
 order && res.status(200).json({ success: true, data: order })
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
 const orders = await Order.find({ user: req.user._id })
 res.json(orders)
})
