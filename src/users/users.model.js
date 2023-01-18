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
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    profit: {
      type: DataTypes.BIGINT,
    },
    progress: {
      type: DataTypes.INTEGER,
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

export const createUser = async (un, pw, em, ph) => {
  const create = await Users.create({
    username: un,
    password: pw,
    email: em,
    phone: ph,
  });
  console.log(un, "'s id : ", create.id);
  return create.id;
};

export const getUserbyId = async (id) => {
  const user = await Users.findOne({
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
    },
    where: {
      id: id,
    },
  });
  return user;
};

export const getUserbyUsername = async (un) => {
  const allUser = await Users.findOne({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: {
      username: un,
    },
  });
  return allUser;
};

export const updateUser = async (id, obj) => {
  let update;

  await Users.update(obj, {
    where: {
      id: id,
    },
  })
    .then((item) => {
      update = item;
    })
    .catch((error) => {
      console.log(error);
      update = {
        error: error.parent.sqlMessage,
      };
    });

  return update;
};

export const deleteUser = async (id) => {
  let deleted;
  await Users.destroy({
    where: {
      id: id,
    },
  })
    .then((del) => {
      deleted = del;
    })
    .catch((error) => {
      deleted = error.parent.sqlMessage;
    });

  return deleted;
};
export default Users;
