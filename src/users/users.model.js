import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";

const Users = newSeq.define(
  "users",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    address: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
  },
  {
    paranoid: true, //soft-delete
  }
);

newSeq
  .sync()
  .then(() => {
    console.log("Users table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export const createUser = async (un, pw, dob, add, gn, ed, ph) => {
  const create = await Users.create({
    username: un,
    password: pw,
    dob: dob,
    address: add,
    status: true,
    gender: gn,
    education: ed,
    phone: ph,
  });
  console.log(un, "'s id : ", create.id);
  return create.id;
};

export const getUserbyId = async (id) => {
  const allUser = await Users.findOne({
    where: {
      id: id,
    },
  });
  return allUser;
};

export const getUserbyUsername = async (un) => {
  const allUser = await Users.findOne({
    where: {
      username: un,
    },
  });
  return allUser;
};

export const deleteUser = async (id) => {
  await Users.destroy({
    where: {
      id: id,
    },
  });
};

export const updateUser = async (id, obj) => {
  await Users.update(obj, {
    where: {
      id: id,
    },
  });
};

export default Users;
