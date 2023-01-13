import { DataTypes } from "sequelize";
import { newSeq } from "../configs/database.js";

const Categories = newSeq.define(
  "categories",
  {
    name: {
      type: DataTypes.CHAR,
      unique: true,
    },
    client_price: {
      type: DataTypes.BIGINT,
    },
    partner_price: {
      type: DataTypes.BIGINT,
    },
    description: {
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
    console.log("Categories table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export const createCategories = async (name, clientP, partnerP, desc) => {
  const create = await Categories.create({
    name: name,
    client_price: clientP,
    partner_price: partnerP,
    description: desc,
  });
  console.log("category's id is:", create.id);
  return create;
};

export const getCategories = async () => {
  const allCategories = await Categories.findAll();
  return allCategories;
};

export const updateCategories = async (id, obj) => {
  const update = await Categories.update(obj, {
    where: {
      id: id,
    },
  });
  return update;
};

export const deleteCategories = async (id) => {
  const deleted = await Categories.destroy({
    where: {
      id: id,
    },
  });
  return deleted;
};

export default Categories;
