import { Sequelize } from "sequelize";
import User from "./user.model.js";
import School from "./school.model.js";
import { sequelize } from "../config/db_connect.js";
import Teacher from "./teacher.model.js";
import Class from "./class.model.js";
import Student from "./student.model.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.School = School;
db.Teacher = Teacher
db.Class = Class
db.Student = Student

// Teacher belongs to one User
Teacher.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Teacher belongs to one School
Teacher.belongsTo(School, { foreignKey: "school_id", onDelete: "CASCADE" });

// Optionally, if you want reverse relations:
User.hasOne(Teacher, { foreignKey: "user_id" });
School.hasMany(Teacher, { foreignKey: "school_id" });
// Relations
User.belongsTo(School, { foreignKey: "school_id" });
School.hasMany(User, { foreignKey: "school_id" });
// Associations
School.hasMany(Class, { foreignKey: "school_id" });
Class.belongsTo(School, { foreignKey: "school_id" });

Class.hasMany(Student, { foreignKey: "class_id" });
Student.belongsTo(Class, { foreignKey: "class_id" });







// Function to sync models with the database
async function syncModels() {
    try {
        // Sync the models with the database
        await db.sequelize.sync({ alter: true });  // Using db.sequelize instead of db
        console.log("Models synchronized successfully.👍");
    } catch (error) {
        console.error("Error synchronizing models:", error);
    }
}

// Using top-level await to properly handle the async operation
await syncModels();
export default db;