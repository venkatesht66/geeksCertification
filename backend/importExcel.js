const express = require('express');
const app = express();
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const XLSX = require("xlsx");
const { MongoClient } = require('mongodb');
const dotEnv = require('dotenv');
const cors = require('cors');

app.use(cors());
dotEnv.config();

const URI = process.env.Mongo_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

async function importExcel() {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        console.log("✅ Connected to MongoDB!");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Load the Excel file
        const workbook = XLSX.readFile("student_template.xlsx");
        const sheetName = workbook.SheetNames[0];
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // console.log("📌 Excel Data:", data);

        if (data.length === 0) {
            console.error("❌ No data found in the Excel file.");
            return;
        }

        data = data.map(student => ({
            ...student,
            certificateId: student.certificateId && student.certificateId.trim() !== "" ? student.certificateId : undefined
        }));

        // await Student.insertMany(data, { ordered: false });


        let newEntries = [];
        for (let student of data) {
            const { studentPhone, studentEmail } = student;

            const existingStudent = await collection.findOne({ studentPhone, studentEmail });

            if (!existingStudent) {
                // Insert new student
                await collection.insertOne(student);
                newEntries.push(student);
            }
        }

        console.log(`✅ Inserted ${newEntries.length} new records.`);

        if (newEntries.length > 0) {
            // Update Excel file only if new records are inserted
            const newSheet = XLSX.utils.json_to_sheet(data);
            workbook.Sheets[sheetName] = newSheet;
            XLSX.writeFile(workbook, "student_template.xlsx");
            console.log("✅ Excel file updated with new records.");
        } else {
            console.log("⚡ No new records found. Excel file remains unchanged.");
        }

        await client.close();
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// Run the function
importExcel();

app.use(bodyParser.json());
app.use('/student', studentRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running at ${PORT}`);
});