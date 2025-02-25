const XLSX = require("xlsx");
const { MongoClient } = require("mongodb");
const path = require("path");
const dotEnv = require('dotenv');
const fs = require("fs");

dotEnv.config();

const excelFilePath = "/Users/tammisettyvenkatesh/Downloads/student_template.xlsx";//path.join(__dirname, "student_template.xlsx");

const stats = fs.statSync(excelFilePath);
console.log("Last modified time:", stats.mtime);
// MongoDB Connection URI
const URI = process.env.Mongo_URI; // Change if using a remote database
const dbName = process.env.DB_NAME; // Database name
const collectionName = process.env.COLLECTION_NAME; // Collection name

async function importExcel() {
    try {
        // Connect to MongoDB
        const client = new MongoClient(URI);
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Load the Excel file
        const workbook = XLSX.readFile("student_template.xlsx"); // Replace with your Excel file name
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON

        console.log("Excel Data:", data); // Optional: Print the data

        if (data.length === 0) {
            console.error("❌ No data found in the Excel file.");
            return;
        }

        // Insert data into MongoDB
        const result = await collection.insertMany(data);
        console.log(`Inserted ${result.insertedCount} records into MongoDB!`);

        // Close MongoDB connection
        await client.close();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the function
importExcel();