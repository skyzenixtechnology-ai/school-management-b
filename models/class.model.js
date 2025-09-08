// models/class.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_connect.js";
import School from "./school.model.js";

const Class = sequelize.define(
    "Class",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        school_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: School,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false, // e.g. "Grade 5"
        },
        section: {
            type: DataTypes.STRING(10), // e.g. "A"
            allowNull: true,
        },
        room_number: {
            type: DataTypes.STRING(25), // e.g. "A"
            allowNull: true,
        },
        base_fee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "classes",
        timestamps: false, // handled manually by DB
    }
);



export default Class;
