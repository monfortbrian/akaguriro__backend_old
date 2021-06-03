import mongoose from 'mongoose'
import { error, info } from '../utils/log.js'
const NAMESPACE = 'SERVER'
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'
export const connectDb = () => {
 mongoose
  .connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
  })
  .then((con) =>
   info(
    NAMESPACE,
    `database up and running..${con.connection.host}/${con.connection.name}`
   )
  )
  .catch((err) => error(NAMESPACE, `DATABASE - error acure ${err.message}`))
}
