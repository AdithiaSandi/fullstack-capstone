import JSONtoken from "jsonwebtoken";
import { getUserbyId } from "../users/users.model.js";
import {
  createOrder,
  deleteOrders,
  getOrdersbyUserId,
  updateOrders,
} from "./order.model.js";
import { createItems } from "../order-items/orderitems.model.js";

export const ordersAdd = async (req, res) => {
  const { type, status, total, items } = req.body;

  if (!(type && status && items)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  }

  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);

  const respModel = await createOrder(decode.id, type, status, total, items);

  const load = [];
  for (const item of items) {
    const entry = await createItems(respModel.id, item);
    load.push(entry);
  }

  return res.status(200).json({
    meta: {
      code: 200,
      message: "success add order",
    },
    data: {
      order_detail: respModel,
      item: load,
    },
  });
};

export const ordersGet = async (req, res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;

  const respModel = await getOrdersbyUserId(id, {
    where: {
      deletedAt: null,
    },
  });
  const username = await getUserbyId(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success get orders of user : " + username,
    },
    data: respModel,
    decode: decode,
  });
};

export const ordersUpdate = async (req, res) => {
  const id = req.body.id;
  const data = req.body.data;

  const respModel = await updateOrders(id, data);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "success update order",
    },
    data: {
      order_id: id,
      payload: data,
    },
    payload: respModel,
  });
};

export const ordersDelete = async (req, res) => {
  const id = req.body.id;

  const respModel = await deleteOrders(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete order",
    },
    data: respModel,
  });
};
