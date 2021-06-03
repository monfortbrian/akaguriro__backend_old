import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

export const getProducts = asyncHandler(async (req, res) => {
 const pageSize = 10
 const page = Number(req.query.pageNumber) || 1
 const sortBy = req.query.sort
  ? req.query.sort.split(',').join(' ')
  : { createdAt: -1 }

 const keyword = req.query.keyword
  ? {
     productName: {
      $regex: req.query.keyword,
      $options: 'i',
     },
    }
  : {}
 const categoryCase = req.query.category
  ? {
     category: req.query.category,
    }
  : keyword
 const count = await Product.countDocuments({ ...categoryCase })
 const products = await Product.find({ ...categoryCase })
  .sort(sortBy)
  .limit(pageSize)
  .skip(pageSize * (page - 1))

 res.json({
  page,
  count: products.length,
  pages: Math.ceil(count / pageSize),
  products,
 })
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
 const { productName, category, description, price, countInstock, brand } =
  req.body
 if (req.user && !req.user.isAdmin) {
  res.status()
  throw new Error('u have to be admin to execute this task...')
 }

 const formatTypes = ['image/png', 'image/jpg', 'image/jpeg']

 for (let i = 0; i < req.files['images'].length; i++) {
  if (!formatTypes.includes(req.files['images'][i].mimetype)) {
   return res.status(200).json({ success: false, message: 'image please...' })
  }
 }

 const imagesfiles = req.files['images'].map(
  (imag) => `${process.env.BASE_URL}:${process.env.PORT}/${imag.path}`
 )
 const product = new Product({
  productName,
  category,
  description,
  price,
  countInstock,
  brand,
  images: imagesfiles,
 })
 console.log(product)
 product
  .save()
  .then((result) => res.status(201).json({ success: true, data: result }))
  .catch((err) => {
   res.status(404).json({ success: false, message: err.message })
  })
})

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res, next) => {
 const product = await Product.findById(req.params.id)

 if (product) {
  res.status(200).json({ success: true, data: product })
 } else {
  res.status(404)
  throw new Error('Product not found')
 }
})

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
 const product = await Product.findById(req.params.id)

 if (product) {
  await product.remove()
  res.status(200).json({ success: true, message: 'product removed...' })
 } else {
  res.status(404)
  throw new Error('Product not found')
 }
})

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
 console.log(req.body)

 Product.findOneAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true,
 })
  .then((result) => res.status(200).json({ success: true, data: result }))
  .catch((err) => {
   res.status(500)
   throw new Error('not update...')
  })
})
// REVIEWS
// @desc create review
// @route /api/v1/products/:id/review
// @access private
export const createProductReview = asyncHandler(async (req, res, next) => {
 req.body.user = await req.user._id

 const prod = await Product.find({ 'reviews.user': req.user._id })
 console.log(prod)
 if (prod) {
  res.status(404)
  throw new Error('u can add review once...')
 }
 Product.findByIdAndUpdate(
  req.params.id,
  {
   $set: { reviews: [...prod.reviews, req.body] },
  },
  { new: true, runValidators: true }
 )
  .then((result) => res.status(200).json({ success: true, data: newUpdate }))
  .catch((err) => {
   res.status(404)
   throw new Error('error product not created')
  })
})
// @desc    delete review
// @route   DELETE api/v1/delete/review/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
 Product.find(
  {
   'reviews._id': req.params.id,
   'reviews.user': req.user.id,
  },
  (err, doc) => {
   if (err) {
    res.status(500)
    throw new Error('u are not the own or reviews does no longer exist')
   } else {
    const { reviews } = doc
    console.log('doc reviews outer here', doc)
    const helper = [].push(reviews)
    doc = {
     ...doc,
     reviews: reviews.filter((rev) => rev._id != req.params.id),
    }
    doc
     .save()
     .then((result) => res.status(200).json({ success: true, data: result }))
     .catch((err) => {
      res.status(500)
      throw new Error('review not deleted...')
     })
   }
  }
 )
})

// @desc    Delete all reviews
// @route   PUT /api/v1/products/:id/deletereviews
// @access  Private/Admin
export const deleteAllReviews = asyncHandler(async (req, res, next) => {
 if (req.user && !req.user.isAdmin) {
  res.status(500)
  throw new Error('error not deleted...')
 }

 Product.findByIdAndUpdate(req.params.id, {
  $set: { reviews: [] },
 })
  .then((result) =>
   res
    .status(200)
    .json({ success: true, message: 'reviews erased successfully...' })
  )
  .catch((err) => {
   res.status(404)
   throw new Error('product not updated...')
  })
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
 const products = await Product.find({}).sort({ rating: -1 }).limit(3)

 res.json(products)
})
