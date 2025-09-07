import { Op } from "sequelize";
import db from "../models/index.model.js";
import bcrypt from "bcrypt";

// Create teacher (with new user + teacher record)
export const createTeacher = async (req, res) => {
    try {
        const { name, email, subject, join_date } = req.body;

        // School comes from logged-in admin
        const school_id = req.user.school_id;
        if (!school_id) {
            return res.status(403).json({ error: "School context missing" });
        }

        // Check if email already exists
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Default password
        const defaultPassword = "12345678";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create user first
        const user = await db.User.create({
            name,
            email,
            password: hashedPassword,
            role: "TEACHER",
            school_id,
        });

        // Create teacher profile linked to user + school
        const teacher = await db.Teacher.create({
            user_id: user.id,
            school_id,
            subject,
            join_date,
        });

        res.status(201).json({
            message: "Teacher registered successfully.",
            teacher,
            defaultPassword, // optional: return for admin to share
        });
    } catch (error) {
        console.error("Error creating teacher:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await db.Teacher.findOne({
            where: { id },
            include: [
                {
                    model: db.User,
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "phone",
                        "gender",
                        "address",
                        "role",
                        "status",
                        "avaitar",
                        "last_login",
                    ],
                },
            ],
        });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        console.error("Error fetching teacher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        // Find teachers by filtering User table (role = TEACHER)
        const teachers = await db.User.findAndCountAll({
            where: {
                role: "TEACHER",
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { phone: { [Op.iLike]: `%${search}%` } },
                ],
            },
            include: [
                {
                    model: db.Teacher,
                    attributes: ["id", "school_id", "subject", "join_date"],
                },
            ],
            attributes: { exclude: ["password"] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["created_at", "DESC"]],
        });

        res.status(200).json({
            total: teachers.count,
            page: parseInt(page),
            limit: parseInt(limit),
            data: teachers.rows,
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            gender,
            address,
            status,
            subject,
            join_date,
        } = req.body;

        // Find teacher with relation to user
        const teacher = await db.Teacher.findOne({
            where: { id },
            include: [{ model: db.User }],
        });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Update User table fields
        if (teacher.User) {
            await teacher.User.update({
                name,
                email,
                phone,
                gender,
                address,
                status,
                updated_at: new Date(),
            });
        }

        // Update Teacher table fields
        await teacher.update({
            subject,
            join_date,
            updated_at: new Date(),
        });

        res.status(200).json({
            message: "Teacher updated successfully",
            data: teacher,
        });
    } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Find teacher
        const teacher = await db.Teacher.findOne({
            where: { id },
            include: [{ model: db.User }],
        });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Delete the user (teacher entry in `teachers` will cascade delete)
        await db.User.destroy({ where: { id: teacher.user_id } });

        res.status(200).json({
            message: "Teacher deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting teacher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
