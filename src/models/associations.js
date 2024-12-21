import Project from "./project.model.js";
import Sector from "./sector.model.js";
import SubSector from "./subSector.model.js";
import User from "./user.model.js";

Project.belongsTo(Sector, { foreignKey: "sector_id" });
// Associations with User
Project.belongsTo(User, {
  foreignKey: "entry_by",
  targetKey: "user_id",
  as: "entryUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "approved_by",
  targetKey: "user_id",
  as: "approvedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "submitted_by",
  targetKey: "user_id",
  as: "submittedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "prepared_by",
  targetKey: "user_id",
  as: "preparedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Sector.hasMany(Project, {
  foreignKey: "sector_id", // The foreign key in the projects table
  as: "Projects", // Alias for the associated model
});

Sector.hasMany(SubSector, {
  foreignKey: "sectorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubSector.belongsTo(Sector, {
  foreignKey: "sectorId",
});
