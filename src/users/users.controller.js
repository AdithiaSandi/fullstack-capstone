import {
  createUser,
  getUserbyId,
  getUserbyUsername,
  deleteUser,
  updateUser,
} from "./users.model.js";
import JSONtoken from "jsonwebtoken";

export const userCreateRest = async (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!(username && password && email && phone)) {
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

  const respModel = await createUser(username, password, email, phone);
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
        message: "Missing JWT",
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

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      meta: {
        code: 400,
        message: "Missing data",
      },
    });
  }

  const user = await getUserbyId(id);
  const userData = Object.keys(user.dataValues);

  const elements = Object.keys(obj);
  existence: for (const item of elements) {
    for (const col of userData) {
      if (item == col) {
        if (typeof item == typeof col) {
          console.log(item + " exist");
          continue existence;
        } else {
          return {
            error: "wrong data type of : " + item,
          };
        }
      }
    }
    return {
      error: "column '" + item + "' doesn't exist",
    };
  }

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
