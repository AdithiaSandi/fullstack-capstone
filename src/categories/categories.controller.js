import {
  createCategories,
  deleteCategories,
  getCategories,
  getCategoriesById,
  updateCategories,
} from "./categories.model.js";

export const categoriesAdd = async (req, res) => {
  const { name, client_price, partner_price, description } = req.body;

  if (!(name && client_price && partner_price && description)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input(s) or element(s)",
      },
    });
  }

  const respModel = await createCategories(
    name,
    client_price,
    partner_price,
    description
  );

  return res.status(200).json({
    meta: {
      code: 200,
      message: "success add category",
    },
    data: {
      id: respModel,
    },
  });
};

export const categoriesGet = async (req, res) => {
  const respModel = await getCategories();
  return res.status(200).json({
    meta: {
      code: 200,
      message: "success get categories",
    },
    data: respModel,
  });
};

export const categoriesUpdate = async (req, res) => {
  const id = req.body.id;
  const data = req.body.data;

  if (!(id && data && Object.keys(data).length > 0)) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "missing element(s) or value(s)",
      },
    });
  }

  const exist = await getCategoriesById(id);
  if (!exist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "category doesn't exist",
      },
    });
  }

  const respModel = await updateCategories(id, data);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "success update category ",
    },
    data: respModel,
  });
};

export const categoriesDelete = async (req, res) => {
  const id = req.body.id;

  const exist = await getCategoriesById(id);
  if (!exist) {
    return res.status(400).json({
      meta: {
        code: 400,
        error: "category doesn't exist",
      },
    });
  }

  const respModel = await deleteCategories(id);

  return res.status(200).json({
    meta: {
      code: 200,
      message: "category deleted",
    },
    data: respModel,
  });
};
