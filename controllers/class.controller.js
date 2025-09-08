import db from "../models/index.model.js";


export const createClass = async (req, res) => {
    try {
        // school_id comes from decoded token (set by auth middleware)
        const school_id = req.user.school_id;
        const { name, section, room_number, base_fee } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Class name is required" });
        }

        const newClass = await db.Class.create({
            school_id,
            name,
            section,
            room_number,
            base_fee,
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const updateClass = async (req, res) => {
    try {
        const { id } = req.params; // class id
        const { name, section, room_number, base_fee } = req.body;
        const school_id = req.user.school_id; // from token

        // Find class under the same school
        const classObj = await db.Class.findOne({
            where: { id, school_id },
        });

        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Update class details
        await classObj.update({
            name: name ?? classObj.name,
            section: section ?? classObj.section,
            room_number: room_number ?? classObj.room_number,
            base_fee: base_fee ?? classObj.base_fee,
            updated_at: new Date(),
        });

        res.status(200).json({
            message: "Class updated successfully",
            data: classObj,
        });
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.school_id; // school from token

        // Check if class exists
        const classItem = await db.Class.findOne({
            where: { id, school_id: schoolId },
        });

        if (!classItem) {
            return res
                .status(404)
                .json({ message: "Class not found or not authorized" });
        }

        // Check if students are assigned to this class
        const studentCount = await db.Student.count({
            where: { class_id: id, school_id: schoolId },
        });

        if (studentCount > 0) {
            return res
                .status(400)
                .json({ message: "Cannot delete class with enrolled students" });
        }

        // Delete class if no students are assigned
        await classItem.destroy();

        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting class:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const school_id = req.user.school_id;

        const classes = await db.Class.findAll({
            where: { school_id },
            attributes: ['id', 'name', 'section', 'room_number']
        });

        if (!classes || classes.length === 0) {
            return res.status(404).json({ message: "No classes found for this school" });
        }

        res.status(200).json({
            message: "Classes fetched successfully",
            data: classes,
        });
    } catch (error) {
        console.error("❌ Error fetching classes:", error);
        res.status(500).json({ error: "Failed to fetch classes" });
    }
};