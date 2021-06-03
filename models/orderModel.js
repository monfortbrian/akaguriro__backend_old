import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.Types.ObjectId,
   required: true,
   ref: 'User',
  },
  orderItems: [
   {
    qty: {
     type: Number,
     required: true,
    },
    image: {
     type: String,
     // required: true,
    },

    price: {
     type: Number,
     required: true,
    },
    product: {
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'Product',
    },
   },
  ],
  shippingAddress: {
   address: { type: String, required: true },
   commune: { type: String, required: true },
   province: { type: String, required: true },
   country: {
    type: String,
    required: true,
   },
  },
  paymentMethod: {
   type: String,
   // required: true,
  },
  paymentResult: {
   id: { type: String },
   status: { type: String },
   update_time: { type: String },
   email_address: { type: String },
  },
  shippingPrice: {
   type: Number,
   // required: true,
   default: 0.0,
  },
  totalPrice: {
   type: Number,
   required: true,
   default: 0.0,
  },
  isPaid: {
   type: Boolean,
   default: false,
  },

  paidAt: {
   type: Date,
  },
  isDelivered: {
   type: Boolean,
   // required: true,
   default: false,
  },
  deliveredAt: {
   type: Date,
  },
 },
 {
  timestamps: true,
 }
)

orderSchema.post('save', function (next) {
 next()
})

export default mongoose.model('Order', orderSchema)
