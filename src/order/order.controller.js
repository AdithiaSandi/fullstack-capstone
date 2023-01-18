import JSONtoken from "jsonwebtoken";
import { getUserbyId } from "../users/users.model.js";
import {
  createOrder,
  deleteOrders,
  getOrdersbyId,
  getOrdersbyUserId,
  getOrdersDistance,
  getOrdersExist,
  updateOrders,
} from "./order.model.js";
import { createItems } from "../order-items/orderitems.model.js";
import axios from "axios";

export const ordersAdd = async (req, res) => {
  const { type, status, total, items } = req.body;

  if (!(type && status && items)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input(s) or element(s)",
      },
    });
  }

  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;

  const respModel = await createOrder(id, type, status, total);

  const load = [];

  if (items.length == 0) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "missing order items",
      },
    });
  }

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

export const ordersGetAll = async (req, res) => {
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

export const ordersGet = async (req, res) => {
  const id = req.body.id;

  const exist = await getOrdersExist(id);
  if (exist == null) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "order doesn't exist",
      },
    });
  }

  const respModel = await getOrdersbyId(id);

  return res.status(200).json({
    meta: {
      code: 200,
      message: "success get order : " + id,
    },
    data: respModel,
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

  const exist = await getOrdersExist(id);
  if (exist == null) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "order doesn't exist",
      },
    });
  }

  const respModel = await deleteOrders(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete order",
    },
    data: respModel,
  });
};

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// 3RD PARTY INTEGRATION /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export const ordersDistance = async (req, res) => {
  const destination = req.body.destination;
  const key = process.env.API_KEY;
  const id = req.body.id;

  const address = await getOrdersDistance(id);

  const origin = address.district;

  var distance;

  var config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${key}`,
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      distance = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  let text = "";
  if (distance.rows[0].elements[0].distance.value > 15000) {
    text = "distance too far( > 15 km )";
  } else {
    text = "sucess get distance";
  }
  return res.status(200).json({
    meta: {
      code: 200,
      message: text,
    },
    data: {
      origin: origin,
      destination: destination,
      distance: distance.rows[0].elements[0].distance.text,
    },
  });
};
