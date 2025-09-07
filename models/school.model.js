import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_connect.js";

const School = sequelize.define(
    "School",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        contact_email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        contact_phone: {
            type: DataTypes.STRING(50),
            allowNull: true,
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
        tableName: "schools",
        timestamps: false,
    }
);

export default School;
