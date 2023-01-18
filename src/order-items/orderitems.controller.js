import { getCategoriesById } from "../categories/categories.model.js";
import { getOrdersExist } from "../order/order.model.js";
import {
  createItems,
  getItemsbyOrderId,
  updateItems,
  deleteItems,
  getItemsbyId,
} from "./orderitems.model.js";

export const itemsAdd = async (req, res) => {
  const { id, data } = req.body;

  if (!(id && data && Object.keys(data).length > 0)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  } else if (!(data.id && data.weight && data.total)) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "missing column",
      },
    });
  }

  const orderExist = await getOrdersExist(id);
  if (!orderExist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "order doesn't exist",
      },
    });
  }

  const categoryExist = await getCategoriesById(data.id);
  if (!categoryExist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "category doesn't exist",
      },
    });
  }

  const respModel = await createItems(id, data);

  return res.status(200).json({
    meta: {
      code: 200,
      message: "success add items",
    },
    data: {
      id: respModel,
    },
  });
};

export const itemsGet = async (req, res) => {
  const id = req.body.id;

  const orderExist = await getOrdersExist(id);
  if (!orderExist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "order doesn't exist",
      },
    });
  }

  const respModel = await getItemsbyOrderId(id, {
    where: {
      deletedAt: null,
    },
  });

  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success get items of order : " + id,
    },
    data: respModel,
  });
};

export const itemsUpdate = async (req, res) => {
  const id = req.body.id;
  const data = req.body.data;

  if (!(id && data && Object.keys(data).length > 0)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  }

  const exist = await getItemsbyId(id);
  if (!exist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "item doesn't exist",
      },
    });
  }

  const column = Object.keys(exist.dataValues);
  const elements = Object.keys(data);
  existence: for (const item of elements) {
    for (const col of column) {
      if (item == col) {
        if (typeof item == typeof col) {
          continue existence;
        } else {
          return res.status(400).json({
            meta: {
              code: 400,
              error: "wrong data type of : " + item,
            },
          });
        }
      }
    }
    return res.status(400).json({
      meta: {
        code: 400,
        error: "column '" + item + "' doesn't exist",
      },
    });
  }

  const respModel = await updateItems(id, data);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "success update item : " + id,
    },
    data: {
      order_id: id,
      payload: data,
    },
    payload: respModel,
  });
};

export const itemsDelete = async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  }

  const exist = await getItemsbyId(id);
  if (!exist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "item doesn't exist",
      },
    });
  }

  const respModel = await deleteItems(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete item : " + id,
    },
    data: respModel,
  });
};
