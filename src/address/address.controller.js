import { createAddress, deleteAddress, getAddressbyUserId, updateAddress } from "./address.model.js";
import JSONtoken from "jsonwebtoken";
import { getUserbyId } from "../users/users.model.js";

export const addressAdd = async (req, res) => {
  const { province, city, district, status, address } = req.body;

  if (!(province && city && district && status && address)) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "missing input",
      },
    });
  }

  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  
  const respModel = await createAddress(decode.id, province, city, district, status, address);

  return res.status(200).json({
    meta: {
      code: 200,
      message: "success add address",
    },
    data: {
      id: respModel,
    },
  });
};


export const addressGet = async (req, res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;

  const respModel = await getAddressbyUserId(id, {
    where: {
      deletedAt: null
    }
  });
  const username = await getUserbyId(id)
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success get address user " + username,
    },
    data: respModel,
    decode: decode,
  });
};


export const addressUpdate = async (req,res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const userID = decode.id;
  const id = req.params.id
  const data = req.body
  
  const respModel = await updateAddress(userID, id, data)
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success update address",
    },
    data: respModel,
    decode: decode,
  });
}

export const addressDelete = async (req,res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const userID = decode.id;

  const id = req.params.id
  
  const respModel = await deleteAddress(userID, id)
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete address",
    },
    data: respModel,
    decode: decode,
  });
}