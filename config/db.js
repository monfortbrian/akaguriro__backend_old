import mongoose from "mongoose";
import { error, info } from "../utils/log.js";
const NAMESPACE = "SERVER";
const URI =
  "mongodb+srv://bluetech:March_2021@cluster0.qbgzx.mongodb.net/ecommerce?ecommerce=true&w=majority";
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
    .catch((err) => error(NAMESPACE, `DATABASE - error acure ${err.message}`));
};
