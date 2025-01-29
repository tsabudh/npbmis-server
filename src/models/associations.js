import Department from "./department.model.js";
import Notification, { UserNotifications } from "./notification.model.js";
import Palika from "./palika.model.js";
import Project from "./project.model.js";
import Sector from "./sector.model.js";
import StrategyCode from "./strategyCode.model.js";
import SubSector from "./subSector.model.js";
import User from "./user.model.js";

Project.belongsTo(Sector, { foreignKey: "sector_id" });
// Associations with User
Project.belongsTo(User, {
  foreignKey: "entry_by",
  targetKey: "id",
  as: "entryUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "approved_by",
  targetKey: "id",
  as: "approvedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "submitted_by",
  targetKey: "id",
  as: "submittedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "prepared_by",
  targetKey: "id",
  as: "preparedUser",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Sector.hasMany(Project, {
  foreignKey: "sector_id", // The foreign key in the projects table
  as: "Projects", // Alias for the associated model
});

Sector.hasMany(SubSector, {
  foreignKey: "sector_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubSector.belongsTo(Sector, {
  foreignKey: "sector_id",
});

Palika.hasMany(User, {
  foreignKey: "palika_id",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

User.belongsTo(Palika, {
  foreignKey: "palika_id",
});

User.belongsToMany(Notification, { through: UserNotifications });
Notification.belongsToMany(User, { through: UserNotifications });

Notification.belongsTo(Palika, { foreignKey: "palika_id", allowNull: true });
Palika.hasMany(Notification, { foreignKey: "palika_id" });

Palika.hasMany(StrategyCode, { foreignKey: "palika_id" });
StrategyCode.belongsTo(Palika, { foreignKey: "palika_id" });

Palika.hasMany(Department, { foreignKey: "palika_id" });
Department.belongsTo(Palika, { foreignKey: "palika_id" });

Project.belongsTo(StrategyCode, { foreignKey: "strategic_code_id" });
StrategyCode.hasMany(Project, {
  foreignKey: "strategic_code_id",
});
