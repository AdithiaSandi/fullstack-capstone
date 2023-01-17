import {
  createUser,
  getUserbyId,
  getUserbyUsername,
  deleteUser,
  updateUser,
} from "./users.model.js";
import JSONtoken from "jsonwebtoken";

export const userCreateRest = async (req, res) => {
  const { username, password, address, dob, phone, gender, education } =
    req.body;

  if (
    !(username && password && address && dob && phone && gender && education)
  ) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "Missing required input",
      },
      data: {},
    });
  }

  const exist = await getUserbyUsername(username);
  if (exist) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "username exist",
      },
    });
  }

  const respModel = await createUser(
    username,
    password,
    day_of_birth,
    address,
    gender,
    education,
    phone
  );
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success add user",
    },
    data: {
      id: respModel,
    },
  });
};

export const userGetByIDRest = async (req, res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;

  if (!id) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "Some input are required",
      },
      data: {},
    });
  }

  const respModel = await getUserbyId(id);
  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success get user " + respModel.username,
    },
    data: respModel,
    decode: decode,
  });
};

export const userDelete = async (req, res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;

  const respModel = await deleteUser(id);

  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success delete user",
    },
    data: respModel,
    decode: decode,
  });
};

export const userUpdate = async (req, res) => {
  const jwt = req.headers["authorization"];
  const bearer = jwt.split(" ");
  const token = bearer[1];
  const decode = JSONtoken.verify(token, process.env.JWT_SECRET);
  const id = decode.id;
  const data = req.body;

  const respModel = await updateUser(id, data);

  if (respModel.error) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "Failed update user",
      },
      data: respModel,
    });
  }

  return res.status(200).json({
    meta: {
      code: 200,
      message: "Success update user",
    },
    data: respModel,
    decode: decode,
  });
};
