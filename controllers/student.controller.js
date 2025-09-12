import db from "../models/index.model.js";

export const createStudent = async (req, res) => {
    try {
        const schoolId = req.user.school_id; // school from token
        const {
            class_id,
            roll_no,
            name,
            gender,
            dob,
            address,
            phone,
            guardian_name,
            guardian_contact,
            admission_date,
        } = req.body;

        // Basic validation
        if (!name || !class_id) {
            return res.status(400).json({ message: "Name and class_id are required" });
        }

        // Ensure class belongs to same school
        const classItem = await db.Class.findOne({
            where: { id: class_id, school_id: schoolId },
        });

        if (!classItem) {
            return res
                .status(404)
                .json({ message: "Class not found or not authorized" });
        }

        // Create student
        const student = await db.Student.create({
            school_id: schoolId,
            class_id,
            roll_no,
            name,
            gender,
            dob,
            address,
            phone,
            guardian_name,
            guardian_contact,
            admission_date,
        });

        res.status(201).json({
            message: "Student created successfully",
            student,
        });
    } catch (error) {
        console.error("❌ Error creating student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await db.Student.findOne({
            where: { id },
            include: [
                {
                    model: db.Class,
                    attributes: ["id", "name", "section"],
                },
            ],
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found or not authorized" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("❌ Error fetching student by ID:", error);
        res.status(500).json({ error: "Failed to fetch student" });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.school_id;
        const {
            class_id,
            roll_no,
            name,
            gender,
            dob,
            address,
            phone,
            guardian_name,
            guardian_contact,
            admission_date,
            status,
        } = req.body;

        // Find student by id + school
        const student = await db.Student.findOne({
            where: { id, school_id: schoolId },
        });

        if (!student) {
            return res
                .status(404)
                .json({ message: "Student not found or not authorized" });
        }

        // If class_id is provided, ensure the class exists under the same school
        if (class_id) {
            const classItem = await db.Class.findOne({
                where: { id: class_id, school_id: schoolId },
            });

            if (!classItem) {
                return res
                    .status(404)
                    .json({ message: "Class not found or not authorized" });
            }
        }

        // Update student details
        await student.update({
            class_id,
            roll_no,
            name,
            gender,
            dob,
            address,
            phone,
            guardian_name,
            guardian_contact,
            admission_date,
            status,
            updated_at: new Date(),
        });

        res.status(200).json({
            message: "Student updated successfully",
            student,
        });
    } catch (error) {
        console.error("❌ Error updating student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.school_id;

        // Check if student exists in this school
        const student = await db.Student.findOne({
            where: { id, school_id: schoolId },
        });

        if (!student) {
            return res
                .status(404)
                .json({ message: "Student not found or not authorized" });
        }

        // TODO: In future, check if student has fees/attendance records before deleting

        await student.destroy();

        res.status(200).json({
            message: "Student deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const school_id = req.user.school_id;

        const students = await db.Student.findAll({
            where: { school_id },
            include: [
                {
                    model: db.Class,
                    attributes: ["id", "name", "section", "base_fee"],
                },
            ],
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this school" });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error("❌ Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

export const getStudentByClass = async (req, res) => {
    try {
        const class_id = req.params.id;
        const students = await db.Student.findAll({
            where: {
                class_id
            }
        })
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this school" });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error("❌ Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });

    }
}