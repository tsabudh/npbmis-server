import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Project = sequelize.define(
  "Project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nepali_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approval_status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "PREPARED",
        "SUBMITTED",
        "APPROVED",
        "SUBMISSION_REJECTED",
        "APPROVAL_REJECTED"
      ),
      allowNull: false,
      defaultValue: "DRAFT",
    },
    status: {
      type: DataTypes.ENUM("NEW_OR_UPCOMING", "ONGOING"),
      allowNull: false,
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sectors",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    implementation_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget_total_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budget_annual_allocation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_period: {
      //TODO Time period should be in date format?? It has ONGOING and TERM_BASED
      type: DataTypes.STRING,
      allowNull: false,
    },
    beneficiaries: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objectives: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expected_outcomes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsible_officer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsible_officer_contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsible_officer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    implementation_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prepared_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    entry_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    associated_documents: {
      //TODO: Should be in array format or associated with different table through mapping
      type: DataTypes.STRING,
      allowNull: true,
    },

    requested_by: {
      type: DataTypes.STRING, //TODO: Should be either sectors or wards or any inputted value
      allowNull: false,
    },
    sdg_code: {
      // Sustainable Development Goal
      type: DataTypes.STRING,
      allowNull: false,
    },
    sdg_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    climate_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    strategic_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority_code: {
      type: DataTypes.ENUM("P1", "P2"),
      allowNull: false,
    },
    project_nature: {
      type: DataTypes.ENUM(
        "LOCAL_LEVEL_PRIDE_PROJECT",
        "GAME_CHANGER_PROJECT",
        "GENERAL"
      ),
      allowNull: false,
    },

    inception_status: {
      type: DataTypes.ENUM("IDENTIFICATION", "EVALUATION"),
      allowNull: true,
      validate: {
        isInceptionStatusRequired(value) {
          if (this.status === "NEW_OR_UPCOMING" && !value) {
            throw new Error(
              'Inception status is required when status is "NEW_OR_UPCOMING"'
            );
          }
        },
      },
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);

export default Project;
