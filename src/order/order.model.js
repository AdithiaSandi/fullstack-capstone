import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";
import Users from "../users/users.model.js";
import Address, { getMainAddress } from "../address/address.model.js";

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
        model: Address,
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

export const createOrder = async (userID, ty, sta, tot) => {
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
  const allOrders = await Orders.findOne({
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
    where: {
      userID: id,
    },
  });
  return allOrders;
};

export const getOrdersbyId = async (id) => {
  const order = await Orders.findOne({
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
    where: {
      id: id,
    },
  });

  const user = await Users.findOne({
    attributes: ["username", "phone"],
    where: {
      id: order.dataValues.userID,
    },
  });

  const address = await Address.findOne({
    attributes: ["province", "city", "district"],
    where: {
      id: order.dataValues.addressID,
    },
  });

  const orderDetail = {
    order: order,
    user: user,
    address: address,
  };

  return orderDetail;
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

export const getOrdersDistance = async (id) => {
  const order = await Orders.findOne({
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
    where: {
      id: id,
    },
  });

  const address = await getMainAddress(order.userID);

  return address;
};

export default Orders;
