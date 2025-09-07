import { Sequelize } from "sequelize";
import User from "./user.model.js";
import School from "./school.model.js";
import { sequelize } from "../config/db_connect.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.School = School;



// Relations
User.belongsTo(School, { foreignKey: "school_id" });
School.hasMany(User, { foreignKey: "school_id" });










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