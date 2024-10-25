import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sequelize from "../utils/database.js";
import { Op } from "sequelize";

const updateLastSeen = async (id) => {
  await User.update(
    { last_seen: sequelize.fn("NOW") },
    {
      where: {
        user_id: id,
        last_seen: {
          [Op.or]: [
            { [Op.lt]: sequelize.literal("NOW() - INTERVAL '5 MINUTES'") },
            { [Op.is]: null },
          ],
        },
      },
    }
  );
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      status: "failure",
      message: "You are not authenticated for this request.",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.token = decodedToken;
    const thisUser = await User.findByPk(decodedToken.id);

    if (!thisUser) {
      return res.status(401).json({
        status: "failure",
        message:
          "Attempted to access using non-existent credentials. Please log in again.",
      });
    }

    res.locals.userId = thisUser.dataValues.user_id;
    res.locals.userRole = thisUser.dataValues.role;

    updateLastSeen(decodedToken.id);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: "failure",
      message: err.message,
      source: "verifyToken",
    });
  }
};

export const refreshToken = (req, res, next) => {
  try {
    const payload = { id: res.locals.userId };

    console.log(payload);

    const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      status: "success",
      token: newToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "failure",
      message: e.message,
      source: "refreshToken",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide username and password.",
      });
    }
    const user = await User.findOne({
      where: { username },
      attributes: { include: ["password_hash"] },
    });

    if (!user) {
      return res.status(400).json({
        status: "failure",
        message: "The username or password is incorrect.",
      });
    }

    console.log("passwords:", password, user.dataValues.password_hash);

    const correctPassword = await bcrypt.compare(
      password,
      user.dataValues.password_hash
    );
    if (!correctPassword) {
      return res.status(400).json({
        status: "failure",
        message: "The username or password is incorrect.",
      });
    }
    const payload = {
      id: user.dataValues.user_id,
    };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await updateLastSeen(user.dataValues.user_id);

    res.status(200).json({
      status: "success",
      id: req.body.userId,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "failure",
      message: e.message,
      source: "login",
    });
  }
};

export const authorizeOnly = (role) => async (req, res, next) => {
  console.log(role);
  if (res.locals.userRole !== role) {
    return res.status(403).json({
      status: "failure",
      message: "You are not authorized to access this route.",
    });
  }

  next();
};
