import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";
import Sector from "./sector.model.js";
import {
  ALL_ADMINS,
  ALL_USER_ROLES,
  USER_JURISDICTIONS,
  USER_ROLES_WITH_PALIKA_JURISDICTION,
} from "../constants/userConstants.js";
import Palika from "./palika.model.js";
import Department from "./department.model.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Matches the nextval('users_id_seq')
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true, // Default is 'true' as per the column_default
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(ALL_USER_ROLES),
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    palika_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "palikas",
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 15],
          msg: "Username must be between 1 and 15 characters.",
        },
        isValidFormat(value) {
          if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) {
            throw new Error(
              "Username must start with a letter and can only contain letters, numbers, underscores (_), and hyphens (-)."
            );
          }
          if (/_{2,}|-{2,}|[_-]$/.test(value)) {
            throw new Error(
              "Username cannot contain consecutive underscores or hyphens, or end with them."
            );
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false, // Not nullable
    },
    last_seen: {
      type: DataTypes.DATE,
    },
    password_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jurisdiction_level: {
      type: DataTypes.ENUM(USER_JURISDICTIONS),
      allowNull: false,
    },
    jurisdiction_wards: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    jurisdiction_departments: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    extra: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password_hash"] },
    },

    modelName: "User",
    tableName: "users",
    timestamps: true,
    validate: {
      async validateRole() {
        if (
          USER_ROLES_WITH_PALIKA_JURISDICTION.includes(this.role) ===
          (this.jurisdiction_level !== "PALIKA")
        ) {
          throw new Error(
            "The specified jurisdiction_level exceeds/undermines the user's role clearance."
          );
        }
      },

      async validateJurisdiction() {
        //  Skip validation if only last_seen is being updated
        if (
          this.changed().length === 1 &&
          this.changed().includes("last_seen")
        ) {
          return;
        }
        const palika = await Palika.findByPk(this.palika_id);
        if (!palika) {
          throw new Error("Invalid palika_id provided.");
        }
        const validateWard = async () => {
          if (
            !this.jurisdiction_wards ||
            this.jurisdiction_wards.length === 0
          ) {
            throw new Error(
              "jurisdiction_wards is required when jurisdiction_level is 'WARD'."
            );
          }

          // Set jurisdiction_departments to null if jurisdiction_level is WARD
          this.jurisdiction_departments = null;
          
          const missingWards = this.jurisdiction_wards.filter(
            (ward) => !palika.wards.includes(ward)
          );

          if (missingWards.length > 0) {
            throw new Error(
              `Invalid ward numbers provided: ${missingWards.join(", ")}`
            );
          }
        };

        const validateDepartment = async () => {
          if (
            !this.jurisdiction_departments ||
            this.jurisdiction_departments.length === 0
          ) {
            throw new Error(
              "jurisdiction_departments is required when jurisdiction_level is 'DEPARTMENT'."
            );
          }

          // Set jurisdiction_wards to null if jurisdiction_level is DEPARTMENT
          this.jurisdiction_wards = null;

          const departments = await Department.findAll({
            where: { id: this.jurisdiction_departments },
            attributes: ["id"],
          });

          const validDepartmentIds = departments.map((dept) => dept.id);
          const invalidDepartments = this.jurisdiction_departments.filter(
            (dept) => !validDepartmentIds.includes(dept)
          );

          if (invalidDepartments.length > 0) {
            throw new Error(
              `The provided palika (palika_id: ${
                this.palika_id
              }) does not have the provided departments (jurisdiction_departments:[ ${invalidDepartments.join(
                ", "
              )} ])`
            );
          }
        };

        const validatePalika = async () => {
          if (this.jurisdiction_level === "PALIKA") {
            this.jurisdiction_wards = null;
            this.jurisdiction_departments = null;
          }
        };

        switch (this.jurisdiction_level) {
          case "WARD":
            await validateWard();
            break;
          case "DEPARTMENT":
            await validateDepartment();
            break;
          case "PALIKA":
            await validatePalika();
            break;
          default:
            break;
        }
      },
    },
  }
);

// Prototype method to update the last_seen field after each login
User.prototype.updateLastSeen = async function () {
  this.last_seen = new Date();
  await this.save({ validate: false });
};
// Hook to ensure username,first_name and last_name is lowercase before saving to the database
User.addHook("beforeSave", (user, options) => {
  if (user.username) {
    user.username = user.username.toLowerCase();
  }
  if (user.first_name) {
    user.first_name = user.first_name.toLowerCase();
  }
  if (user.last_name) {
    user.last_name = user.last_name.toLowerCase();
  }
});

// Regular expression to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Add beforeSave hook to validate email
User.addHook("beforeSave", (user, options) => {
  if (user.email && !validator.isEmail(user.email)) {
    throw new Error("Invalid email format");
  }
  if (user.email && !emailRegex.test(user.email)) {
    throw new Error("Invalid email format");
  }
});

// Logging password changed date and time
User.addHook("beforeSave", async (user, options) => {
  if (user.changed("password_hash") && !user.isNewRecord) {
    user.password_modified_date = new Date();
  }
});

export default User;
