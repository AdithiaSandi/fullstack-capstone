import {
  createItems,
  getItemsbyOrderId,
  updateItems,
  deleteItems,
} from "./orderitems.model.js";

export const itemsAdd = async (req, res) => {
  const { id, obj } = req.body;

  if (!(id && obj)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  }

  const respModel = await createItems(id, obj);

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

  const respModel = await updateItems(id, data);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "success update item : " + respModel,
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

  const respModel = await deleteItems(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete item : " + id,
    },
    data: respModel,
  });
};
