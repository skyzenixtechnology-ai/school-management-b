import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_connect.js";
import School from "./school.model.js";
import Class from "./class.model.js";

const Student = sequelize.define(
    "Student",
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
        class_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Class,
                key: "id",
            },
            onDelete: "SET NULL",
        },
        roll_no: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        guardian_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        guardian_contact: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        admission_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
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
        tableName: "students",
        timestamps: false, // handled manually
    }
);

export default Student;
