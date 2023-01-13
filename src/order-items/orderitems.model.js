import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";
import Categories from "../categories/categories.model.js";
import Orders from "../order/order.model.js";

const OrdersItems = newSeq.define(
  "ordersItems",
  {
    orderID: {
      type: DataTypes.INTEGER,
      references: {
        model: Orders,
        key: "id",
        constraints: false,
      },
    },
    categoriesID: {
      type: DataTypes.INTEGER,
      references: {
        model: Categories,
        key: "id",
      },
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    total: {
      type: DataTypes.BIGINT,
    },
  },
  {
    paranoid: true, //soft-delete
  }
);

newSeq
  .sync()
  .then(() => {
    console.log("OrderItems table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export const createItems = async (id, obj) => {
  const create = await OrdersItems.create({
    orderID: id,
    categoriesID: obj.id,
    weight: obj.weight,
    total: obj.total,
  });
  console.log("item's id is:", create.dataValues);
  return create.dataValues;
};

export const getItemsbyOrderId = async (id) => {
  const allItems = await OrdersItems.findAll({
    where: {
      orderID: id,
    },
  });
  return allItems;
};

export const updateItems = async (id, obj) => {
  const update = await OrdersItems.update(obj, {
    where: {
      id: id,
    },
  });
  console.log(update);
  return update;
};

export const deleteItems = async (id) => {
  const deleted = await OrdersItems.destroy({
    where: {
      id: id,
    },
  });
  console.log(deleted);
  return deleted;
};

export default OrdersItems;
