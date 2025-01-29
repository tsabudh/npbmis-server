import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import {
  PROJECT_APPROVAL_STATUS,
  PROJECT_BUDGET_CYCLE_TYPE,
  PROJECT_CLIMATE_CODES,
  PROJECT_FUNDING_POLICY,
  PROJECT_FUNDING_SOURCE,
  PROJECT_GENDER_CODES,
  PROJECT_INCEPTION_STATUS,
  PROJECT_NATURE,
  PROJECT_PRIORITY_CODES,
  PROJECT_SELECTED_BY,
  PROJECT_STATE,
} from "../constants/projectConstants.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
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
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approval_status: {
      type: DataTypes.ENUM(PROJECT_APPROVAL_STATUS),
      allowNull: false,
      defaultValue: "DRAFT",
    },
    state: {
      type: DataTypes.ENUM(PROJECT_STATE),
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
    sub_sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sub_sectors",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    implementation_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    implementation_wards: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Defines the field as an array of integers
      allowNull: false,
      validate: {
        isValidArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Implementation ward must be an array of numbers.");
          }
          if (value.some((ward) => ward < 1 || ward > 35)) {
            throw new Error("Each ward number must be between 1 and 35.");
          }
        },
      },
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    annual_allocation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budget_cycle_type: {
      //TODO Time period should be in date format?? It has ONGOING and TERM_BASED
      type: DataTypes.ENUM(PROJECT_BUDGET_CYCLE_TYPE),
      allowNull: false,
    },
    budget_term_period: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidFormat(value) {
          if (this.budget_cycle_type !== "TERM_BASED") {
            this.budget_term_period = null;
            return;
          }
          const regex = /^\d{4}\/\d{4} - \d{4}\/\d{4}$/; // Matches YYYY/YYYY - YYYY/YYYY format
          if (!regex.test(value)) {
            throw new Error(
              "The fiscal year term period must be in the format 'YYYY/YYYY - YYYY/YYYY'."
            );
          }

          // Split the string into the two parts
          const [firstPeriod, secondPeriod] = value.split(" - ");

          // Validate each period (YYYY/YYYY)
          const validatePeriod = (period) => {
            const [start, end] = period.split("/").map(Number); // Split into start and end years
            if (end !== start + 1) {
              throw new Error(
                "Each fiscal year format must be in YYYY/YYYY+1 For eg: 2080/2081"
              );
            }
            return [start, end];
          };

          const [firstStart, firstEnd] = validatePeriod(firstPeriod);
          const [secondStart, secondEnd] = validatePeriod(secondPeriod);

          // Ensure the first pair is earlier than the second pair
          if (firstEnd > secondStart) {
            throw new Error(
              "The first fiscal year must end before the second fiscal year starts."
            );
          }
        },
      },
    },
    beneficiaries_total_houses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Total houses must be an integer.",
        },
        min: {
          args: [0],
          msg: "Total houses cannot be negative.",
        },
      },
    },
    beneficiaries_population: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Population must be an integer.",
        },
        min: {
          args: [0],
          msg: "Population cannot be negative.",
        },
      },
    },
    beneficiaries_dalit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Dalit beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Dalit beneficiaries count cannot be negative.",
        },
      },
    },
    beneficiaries_indigenous: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Indigenous beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Indigenous beneficiaries count cannot be negative.",
        },
      },
    },
    beneficiaries_janajati: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Janajati beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Janajati beneficiaries count cannot be negative.",
        },
      },
    },
    beneficiaries_male: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Male beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Male beneficiaries count cannot be negative.",
        },
      },
    },
    beneficiaries_female: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Female beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Female beneficiaries count cannot be negative.",
        },
      },
    },
    beneficiaries_diff_abled: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Differently-abled beneficiaries count must be an integer.",
        },
        min: {
          args: [0],
          msg: "Differently-abled beneficiaries count cannot be negative.",
        },
      },
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
    entry_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    prepared_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    evaluated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
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
      type: DataTypes.ENUM(PROJECT_GENDER_CODES),
      allowNull: false,
      validate: {
        isIn: {
          args: [PROJECT_GENDER_CODES],
          msg: "Gender code must be one of the following values: 1, 2, or 3.",
        },
      },
    },
    climate_code: {
      type: DataTypes.ENUM(PROJECT_CLIMATE_CODES),
      allowNull: false,
      validate: {
        isIn: {
          args: [PROJECT_CLIMATE_CODES],
          msg: "Climate code must be one of the following values: 1, 2, or 3.",
        },
      },
    },
    strategic_code_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "strategy_codes",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    priority_code: {
      type: DataTypes.ENUM(PROJECT_PRIORITY_CODES),
      allowNull: false,
    },
    project_nature: {
      type: DataTypes.ENUM(PROJECT_NATURE),
      allowNull: false,
    },

    inception_status: {
      type: DataTypes.ENUM(PROJECT_INCEPTION_STATUS),
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
    selection_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    selected_date: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidFormat(value) {
          if (this.selection_status == false) {
            this.selected_date = null;
            this.selected_by = null;
            return;
          }

          const regex = /^\d{4}\/\d{2}\/\d{2}$/;
          if (!regex.test(value)) {
            throw new Error(
              "The selected date must be in the format 'YYYY/MM/DD'."
            );
          }
        },
      },
    },
    selected_by: {
      type: DataTypes.ENUM(PROJECT_SELECTED_BY),
      allowNull: true,
    },
    selection_document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    funding_source: {
      type: DataTypes.ENUM(PROJECT_FUNDING_SOURCE),
      allowNull: false,
    },
    funding_policy: {
      type: DataTypes.ENUM(PROJECT_FUNDING_POLICY),
      allowNull: true, // Will only be required for certain funding sources
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

Project.beforeSave((project, options) => {
  if (project.state === "NEW_OR_UPCOMING")
    if (!project.inception_status) {
      throw new Error(
        'Inception status is required when status is "NEW_OR_UPCOMING"'
      );
    } else if (project.state === "ONGOING") {
      project.inception_status = null;
    }

  // Budget term period is required when budget cycle type is TERM_BASED
  if (project.budget_cycle_type === "TERM_BASED") {
    if (!project.budget_term_period) {
      throw new Error(
        'Budget term period is required when budget cycle type is "TERM_BASED"'
      );
    }
  } else if (project.budget_cycle_type === "ANNUAL") {
    project.budget_term_period = null;
  }

  // Selected status requires selected date and selected by
  if (project.selection_status) {
    if (!project.selected_date && !project.selected_by) {
      throw new Error(
        "Selected date and selected by is required when selected status is true"
      );
    }
  } else {
    project.selected_date = null;
    project.selected_by = null;
  }

  if (project.funding_source !== "SELF" && !project.funding_policy) {
    throw new Error(
      "Funding policy is required when funding source is not SELF."
    );
  }
});

export default Project;
