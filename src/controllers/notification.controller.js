import { Op } from "sequelize";

import Notification, {
  UserNotifications,
} from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Notification,
          through: {
            attributes: ["readStatus"],
          },
        },
      ],
      order: [[Notification, "createdAt", "DESC"]],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found", code: 1 });
    }

    UserNotifications.update(
      { readStatus: true },
      { where: { userId: req.token.id, readStatus: false } }
    ).catch((e) => {
      console.log(e);
    });

    return res.status(200).json(user.notifications);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export const getHasUnread = async (req, res) => {
  try {
    const user = await User.findByPk(req.token.id, {
      include: [
        {
          model: Notification,
          through: {
            attributes: ["readStatus"],
            where: {
              readStatus: 0,
            },
          },
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found", code: 1 });
    }

    return res.status(200).json({ hasUnread: !!user?.notifications?.length });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

async function deleteNotifications() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  try {
    await Notification.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoff,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export const getRoleWiseNotifications = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    const userPalikaId = res.locals.userPalikaId;

    const notificationType =
      userRole === "DATA_PREPARE"
        ? "PROJECT_ASSIGNED:PREPARE"
        : userRole === "DATA_SUBMIT"
        ? "PROJECT_ASSIGNED:SUBMIT"
        : userRole === "DATA_APPROVE"
        ? "PROJECT_ASSIGNED:APPROVE"
        : "PROJECT_NOTICE";

    const notifications = await Notification.findAll({
      where: {
        type: {
          [Op.in]: [notificationType, "PROJECT_NOTICE"], // Include both values
        },
        palika_id: userPalikaId,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};
