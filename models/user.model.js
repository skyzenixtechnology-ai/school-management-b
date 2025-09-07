import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_connect.js";
import School from "./school.model.js";

const User = sequelize.define(
    "User",
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
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN", "TEACHER", "STUDENT", "PARENT"),
            allowNull: false,
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
        tableName: "users",
        timestamps: false, // handled manually in DB
    }
);


export default User;
