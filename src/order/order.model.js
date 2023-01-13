import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";
import Users from "../users/users.model.js";
import Addresses from "../address/address.model.js";
import { getMainAddress } from "../address/address.model.js";

const Orders = newSeq.define(
  "orders",
  {
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
    },
    addressID: {
      type: DataTypes.INTEGER,
      references: {
        model: Addresses,
        key: "id",
      },
    },
    type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
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
    console.log("Orders table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export const createOrder = async (userID, ty, sta, tot, arrItems) => {
  const addressID = await getMainAddress(userID);
  const create = await Orders.create({
    userID: userID,
    addressID: addressID.id,
    type: ty,
    status: sta,
    total: tot,
  });
  console.log("order's id is:", create.id);

  return create;
};

export const getOrdersbyUserId = async (id) => {
  const allOrders = await Orders.findAll({
    where: {
      userID: id,
    },
  });
  return allOrders;
};

export const updateOrders = async (id, obj) => {
  const update = await Orders.update(obj, {
    where: {
      id: id,
    },
  });
  return update;
};

export const deleteOrders = async (id) => {
  const deleted = await Orders.destroy({
    where: {
      id: id,
    },
  });
  return deleted;
};

export default Orders;
