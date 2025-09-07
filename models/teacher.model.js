import { DataTypes } from "sequelize";
import { sequelize } from "../config/db_connect.js";

const Teacher = sequelize.define("Teacher", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    school_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    join_date: {
        type: DataTypes.DATEONLY,
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
}, {
    tableName: "teachers",
    timestamps: false,
});

export default Teacher;
