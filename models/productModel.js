import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
 {
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
   type: mongoose.Schema.Types.ObjectId,
   required: true,
   ref: 'User',
  },
 },
 {
  timestamps: true,
 }
)
const productSchema = mongoose.Schema(
 {
  productName: {
   type: String,
   required: true,
   unique: true,
  },
  images: [],
  category: {
   type: String,
   enum: [
    'furniture',
    'food',
    'beverage',
    'grocery',
    'mobile_phone',
    'computer',
    'accessory',
   ],
   required: true,
  },
  description: {
   type: String,
   required: true,
  },
  brand: {
   type: String,

  },
  reviews: [reviewSchema],
  rating: {
   type: Number,
   required: true,
   default: 0,
  },
  numReviews: {
   type: Number,
   required: true,
   default: 0,
  },
  price: {
   type: Number,
   required: true,
   default: 0,
  },
  countInStock: {
   type: Number,
   required: true,
   default: 0,
  },
 },
 {
  timestamps: true,
 }
)
const Product = mongoose.model('Product', productSchema)

export default Product
