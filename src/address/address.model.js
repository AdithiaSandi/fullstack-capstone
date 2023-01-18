import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";
import Users from "../users/users.model.js";

const Address = newSeq.define(
  "address",
  {
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
    },
    province: {
      type: DataTypes.CHAR,
    },
    city: {
      type: DataTypes.CHAR,
    },
    district: {
      type: DataTypes.CHAR,
    },
    status: {
      type: DataTypes.CHAR,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true, //soft-delete
  }
);

newSeq
  .sync()
  .then(() => {
    console.log("Address table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export const createAddress = async (id, pr, ci, di, sta, add) => {
  const create = await Address.create({
    userID: id,
    province: pr,
    city: ci,
    district: di,
    status: sta,
    address: add,
  });
  console.log("address's id is:", create.id);
  return create;
};

export const getAddressbyUserId = async (id) => {
  const allAddresses = await Address.findAll({
    where: {
      userID: id,
    },
  });
  return allAddresses;
};

export const getMainAddress = async (id) => {
  const mainAddress = await Address.findOne({
    where: {
      userID: id,
      status: "utama",
    },
  });
  return mainAddress;
};

export const getAddress = async (id) => {
  const data = await Address.findOne({
    where: {
      id: id,
      deletedAt: null
    },
  });
  return data;
};

export const updateAddress = async (userID, id, obj) => {
  const address = await getAddressbyUserId(userID);
  if (obj.status) {
    if (obj.status == "utama") {
      for (const data of address) {
        await Address.update(
          { status: "cadangan" },
          {
            where: {
              id: data.id,
            },
          }
        );
      }
    }
  }
  const update = await Address.update(obj, {
    where: {
      id: id,
      userID: userID,
    },
  });
  return update;
};

export const deleteAddress = async (userID, id) => {
  await Address.destroy({
    where: {
      id: id,
      userID: userID,
    },
  });
};

export default Address;
