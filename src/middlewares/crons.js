import { Op } from "sequelize";
import Token from "../models/token.model.js";

const deleteExpiredTokens = async () => {
    try {
      await Token.destroy({
        where: {
          expiresAt: { [Op.lt]: new Date() }, // Delete tokens where expiresAt is less than the current date
        },
      });
      console.log("Expired tokens deleted successfully.");
    } catch (error) {
      console.error("Error deleting expired tokens:", error);
    }
  };


// Run cleanup every 5 minutes
setInterval(deleteExpiredTokens, 5 * 60 * 1000); // 5 minutes