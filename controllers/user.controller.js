import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from '../models/index.model.js'
import School from "../models/school.model.js";

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            role,
            schoolName,
            schoolAddress,
            schoolEmail,
            schoolPhone,
        } = req.body;

        // check if email already exists
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "db.User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create school
        const school = await School.create({
            name: schoolName,
            address: schoolAddress,
            contact_email: schoolEmail,
            contact_phone: schoolPhone,
        });

        // create user linked to school
        const user = await db.User.create({
            school_id: school.id,
            name,
            email,
            phone,
            password: hashedPassword,
            role: role || "ADMIN",
        });

        // generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, school_id: school.id },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "db.User & School registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                school_id: school.id,
            },
            school,
            token,
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ===================
// Login Controller
// ===================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await db.User.findOne({ where: { email }, include: School });
        if (!user) {
            return res.status(404).json({ message: "db.User not found" });
        }

        if (user.status !== "ACTIVE") {
            return res.status(403).json({ message: "db.User account is inactive" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, school_id: user.school_id },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                school_id: user.school_id,
            },
            school: user.School,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


/**
 * Get user by ID (with school info if needed)
 */
export const getUserById = async (req, res) => {
    try {
        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({ message: "Unauthorized, user id missing" });
        }

        const user = await db.User.findByPk(id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: db.School,
                    attributes: ["id", "name", "address", "contact_email", "contact_phone"]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User details found",
            data: user
        });
    } catch (err) {
        console.error("Error in getUserById:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id; // from verifyToken middleware

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        // Fetch user
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "db.User not found" });
        }

        if (!user.password) {
            return res.status(500).json({ message: "db.User password is missing in DB" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save new password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error in changePassword:", err);
        res.status(500).json({ message: "Server error" });
    }
};



// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { db.User } from "../models/index.js";
// import { ResetToken } from "../models/resetToken.js"; // if you store tokens in DB

// // ===================
// // Request Password Reset
// // ===================
// export const requestPasswordReset = async (req, res) => {
//     try {
//         const { email } = req.body;

//         const user = await db.User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ message: "db.User not found" });
//         }

//         // generate token (UUID-like)
//         const token = crypto.randomBytes(32).toString("hex");
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min expiry

//         // save token in DB
//         await ResetToken.create({
//             user_id: user.id,
//             token,
//             expires_at: expiresAt,
//         });

//         // Normally you would send via email — here we just return it for testing
//         return res.status(200).json({
//             message: "Password reset token generated",
//             resetToken: token
//         });
//     } catch (error) {
//         console.error("Request reset error:", error);
//         return res.status(500).json({ message: "Server error" });
//     }
// };



// // ===================
// // Reset Password (using token)
// // ===================
// export const resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     // find reset token
//     const resetRecord = await ResetToken.findOne({ where: { token } });
//     if (!resetRecord) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     if (resetRecord.expires_at < new Date()) {
//       return res.status(400).json({ message: "Token expired" });
//     }

//     // get user
//     const user = await db.User.findByPk(resetRecord.user_id);
//     if (!user) {
//       return res.status(404).json({ message: "db.User not found" });
//     }

//     // hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     // delete used token
//     await resetRecord.destroy();

//     return res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
