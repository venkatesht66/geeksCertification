const express = require("express");
const XLSX = require("xlsx");
const fs = require("fs");
const { adminLogin } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const Student = require("../models/Student"); // Ensure your Mongoose Student model is imported
const multer = require("multer"); // For handling file uploads
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", adminLogin);

// router.post("/upload-excel", authMiddleware, upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//         const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//         let studentsAdded = 0;
//         let studentsUpdated = 0;
//         for (const student of data) {
//             const { studentName, studentEmail, studentPhone, studentCourseName, certificateId } = student;
//             const existingStudent = await Student.findOne({ studentEmail });
//             if (existingStudent) {
//                 await Student.updateOne({ studentEmail }, { $set: student });
//                 studentsUpdated++;
//             } else {
//                 await Student.create({ studentName, studentEmail, studentPhone, studentCourseName, certificateId });
//                 studentsAdded++;
//             }
//         }
//         res.status(200).json({ message: `Upload successful! ${studentsAdded} added, ${studentsUpdated} updated.` });
//     } catch (error) {
//         console.error("Error processing Excel upload:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// });

router.post('/upload-excel/:type',authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { type } = req.params;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let Model = type === "course" ? CourseStudent : InternshipStudent;
        let studentsAdded = 0;
        let studentsUpdated = 0;

        for (const student of data) {
            const { studentEmail } = student;
            const existingStudent = await Model.findOne({ studentEmail });

            if (existingStudent) {
                await Model.updateOne({ studentEmail }, { $set: student });
                studentsUpdated++;
            } else {
                await Model.create(student);
                studentsAdded++;
            }
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: `Upload successful! ${studentsAdded} added, ${studentsUpdated} updated.` });

    } catch (error) {
        console.error('❌ Error uploading Excel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/register-student", authMiddleware, async (req, res) => {
    let { studentName, studentEmail, studentPhone, studentCourseName, studentCourseCompleted } = req.body;
    studentCourseCompleted = studentCourseCompleted === true || studentCourseCompleted === "true";
    try {
        const existingStudent = await Student.findOne({ $or: [{ studentEmail }, { studentPhone }] });

        if (existingStudent) {
            return res.status(400).json({ message: "Email or Phone Number Already Exists" });
        }
        const newStudent = new Student({
            studentName,
            studentEmail,
            studentPhone,
            studentCourseName,
            studentCourseCompleted,
            certificateId: null
        });
        await newStudent.save();
        const filePath = "student_template.xlsx";
        if (!fs.existsSync(filePath)) {
            console.warn("⚠️ Excel file not found! Student added to DB, but NOT to Excel.");
            return res.status(201).json({ 
                message: "Student Registered in DB, but Excel file was missing." 
            });
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);
        data.push({
            studentName,
            studentEmail,
            studentPhone,
            studentCourseName,
            studentCourseCompleted: studentCourseCompleted ? true : false,
            certificateId: ""
        });

        if (!studentName || !studentEmail || !studentPhone) {
            return res.status(400).json({ error: "Missing required student data" });
        }

        const newSheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;
        try {
            XLSX.writeFile(workbook, filePath);
        } catch (err) {
            console.error("❌ Failed to update Excel:", err);
            return res.status(500).json({ error: "Failed to update Excel file" });
        }
        res.status(201).json({ message: "Student Registered Successfully & Added to Excel" });
        console.log("✅ Student Registered & Excel Updated");
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/edit-student", authMiddleware, async (req, res) => {
    const { studentPhone } = req.body;
    if (!studentPhone) {
        return res.status(400).json({ error: "Student phone number is required" });
    }
    console.log("Received Student Phone:", studentPhone);
    try {
        const student = await Student.findOne({ studentPhone });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/edit-student", authMiddleware, async (req, res) => {
    const { studentPhone, updates } = req.body;
    if (!studentPhone) {
        return res.status(400).json({ error: "Student phone number is required" });
    }
    console.log("Received Student Phone:", studentPhone);
    console.log("Updates received:", updates);
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { studentPhone }, // Find by phone number
            { $set: updates }, 
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found in DB" });
        }
        const filePath = "student_template.xlsx";
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: "Excel file not found!" });
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);

        let studentUpdated = false;
        data = data.map((student) => {
            if (String(student.studentPhone) === String(studentPhone)) {
                studentUpdated = true;
                return { ...student, ...updates };
            }
            return student;
        });
        if (!studentUpdated) {
            return res.status(404).json({ message: "Student not found in Excel" });
        }
        const newSheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;
        XLSX.writeFile(workbook, filePath);
        res.status(200).json({ message: "Student Details Updated Successfully in DB & Excel", updatedStudent });
        console.log("✅ Student Details Updated Successfully");
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete-student", authMiddleware, async (req, res) => {
    const { studentPhone } = req.body;
    if (!studentPhone) {
        return res.status(400).json({ error: "Student phone number is required" });
    }
    try {
        const student = await Student.findOne({ studentPhone });
        if (!student) {
            return res.status(404).json({ error: "Student not found in DB" });
        }
        await Student.deleteOne({ studentPhone });
        const filePath = "student_template.xlsx";
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: "Excel file not found!" });
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);
        const newData = data.filter(student => String(student.studentPhone) !== String(studentPhone));
        const newSheet = XLSX.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = newSheet;
        XLSX.writeFile(workbook, filePath);
        res.status(200).json({ message: "Student deleted successfully from DB & Excel" });
        console.log("✅ Student Deleted Successfully");
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;