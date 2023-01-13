import "./configs/env.js";
import express from "express";
import userRoute from "./users/users.routes.js";
import authRoute from "./auth/auth.routes.js";
import addressRoute from "./address/address.routes.js";
import orderRoute from "./order/order.routes.js";
import categoriesRoute from "./categories/categories.routes.js";
import itemsRoute from "./order-items/orderitems.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", addressRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", categoriesRoute);
app.use("/api/v1", itemsRoute);

// start server
app.listen(process.env.API_PORT, () => {
  console.log(`Express API is listening on port ${process.env.API_PORT}`);
});
