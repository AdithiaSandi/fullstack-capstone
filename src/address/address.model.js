import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";
import Users from "../users/users.model.js";

const Address = newSeq.define("address", {
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
});

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
