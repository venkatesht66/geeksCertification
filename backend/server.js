const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');

const Student = require('./models/Student');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB Connection
const URI = process.env.Mongo_URI;
const dbName = process.env.DB_NAME;

mongoose
    .connect(URI, {
        serverSelectionTimeoutMS: 5000, // Improved error handling
    })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

async function importExcel(filePath, type) {
    try {
        console.log(`📂 Starting ${type} Excel Import...`);

        // Load the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            console.error(`❌ No data found in ${type} Excel file.`);
            return;
        }

        let newEntries = 0;
        let duplicateEntries = 0;

        for (let student of data) {
            const { studentEmail, studentPhone } = student;

            // 🔹 Convert "TRUE" / "FALSE" strings to actual Boolean values
            student.courseCompleted = student.courseCompleted === "TRUE";
            student.internshipCompleted = student.internshipCompleted === "TRUE";

            let Model = type === "course" ? CourseStudent : InternshipStudent;
            const existingStudent = await Model.findOne({ studentEmail });

            if (!existingStudent) {
                await Model.create(student);
                newEntries++;
            } else {
                duplicateEntries++;
            }
        }

        console.log(`✅ ${type} Data Inserted: ${newEntries} new records.`);
        console.log(`⚠️ ${type} Data Skipped: ${duplicateEntries} duplicate records.`);

    } catch (error) {
        console.error(`❌ Error importing ${type} Excel:`, error);
    }
}

// Run both imports at startup
importExcel("course_students.xlsx", "course");
importExcel("internship_students.xlsx", "internship");


// Routes
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at ${PORT}`);
});
