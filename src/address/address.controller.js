import { createAddress } from "./address.model.js";
import JSONtoken from "jsonwebtoken";

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
