const fs = require("fs");
const XLSX = require("xlsx");
// const path = require("path");
// const Student = require('../models/Student');

const updateExcelFile = (studentPhone, studentEmail, certificateId) => {
    try {
        const workbook = XLSX.readFile("student_template.xlsx");
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);

        // Find and update the student record
        data = data.map(student => {
            if (student.studentPhone === studentPhone && student.studentEmail === studentEmail) {
                return { ...student, certificateId };
            }
            return student;
        });

        // Convert JSON back to sheet
        const newSheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;

        // Write back to Excel file
        XLSX.writeFile(workbook, "student_template.xlsx");
        console.log("✅ Excel File Updated Successfully");
    } catch (error) {
        console.error("❌ Error updating Excel file:", error);
    }
};

const studentRegister = async (req, res) => {
    let { studentName, studentEmail, studentPhone, studentCourseName, studentCourseCompleted } = req.body;
    studentCourseCompleted = studentCourseCompleted === true || studentCourseCompleted === "true";

    try {
        // const studentemail = await Student.findOne({ studentEmail });
        // const studentphone = await Student.findOne({ studentPhone });
        const workbook = XLSX.readFile("student_template.xlsx"); // Load the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        let studentRecord = data.find(student => String(student.studentPhone) === String(studentPhone) && student.studentEmail === studentEmail);

        if (studentRecord) {
            return res.status(400).json('Email or Phone Number Already Exists')
        }

        // const newStudent = new Student({
        //     studentName,
        //     studentEmail,
        //     studentPhone,
        //     studentCourseName,
        //     studentCourseCompleted,
        //     certificateId: undefined
        // });

        // await newStudent.save();

        // ✅ Add Student to Excel File
        const filePath = "student_template.xlsx";

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: "Excel file not found!" });
        }

        // const workbook = XLSX.readFile(filePath);
        // const sheetName = workbook.SheetNames[0];
        // const worksheet = workbook.Sheets[sheetName];

        // // Convert existing data to JSON
        // let data = XLSX.utils.sheet_to_json(worksheet);

        // Add new student data
        data.push({
            studentName,
            studentEmail,
            studentPhone,
            studentCourseName,
            studentCourseCompleted: studentCourseCompleted ? "TRUE" : "FALSE",
            certificateId: ""
        });

        // Convert JSON back to sheet
        const newSheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;

        // Write back to Excel file
        XLSX.writeFile(workbook, filePath);

        res.status(201).json({ message: "Student Registered Successfully & Added to Excel" });
        console.log("✅ Student Registered & Excel Updated");

        // await newStudent.save();
        // res.status(201).json({ message: "Student Registered Successfully" });
        console.log('Registered');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Interal Server Error" });
    }
}

const studentLogin = async (req, res) => {
    const { studentPhone, studentEmail } = req.body;
    try {
        const workbook = XLSX.readFile("student_template.xlsx"); // Load the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON

        console.log("🔥 Excel Data Loaded:", data); // <-- Add this line

        // Find student in the Excel file
        let studentRecord = data.find(student => String(student.studentPhone) === String(studentPhone) && student.studentEmail === studentEmail);

        console.log("🔍 Searching for:", { studentPhone, studentEmail }); // <-- Add this line

        if (!studentRecord) {
            console.log("❌ Student Not Found in Excel!");  // <-- Add this line
            return res.status(404).json({ message: "Student Details Not Found in Excel" });
        }

        if (studentRecord.studentCourseCompleted === "FALSE") {
            return res.status(200).json({ message: "Student Course Not Completed" });
        }

        // If certificate already exists, return it
        if (studentRecord.certificateId) {
            return res.status(200).json({
                message: "Course Completed Successfully",
                certificateId: studentRecord.certificateId,
                // expireDate: new Date(studentRecord.expireDate).toISOString().split("T")[0],
                studentName: studentRecord.studentName,
                studentCourseName: studentRecord.studentCourseName
            });
        }

        // const student = await Student.findOne({ studentPhone, studentEmail });
        // if (!student) {
        //     return res.status(404).json({ message: "Student Details Not Found in Database" });
        // }

        // if (student.studentCourseCompleted === "FALSE") {
        //     return res.status(200).json({ message: "Student Course Not Completed" });
        // }

        const coursePrefixes = {
            "Full Stack Web Development": "FSWB",
            "Gen AI": "GAI",
            "Data Science": "DS",
            "Data Analytics": "DA",
            "AWS": "AWS"
        };
        const courseCode = coursePrefixes[studentRecord.studentCourseName] || "GEN";
        const certificateId = `BL${courseCode}${Math.ceil(Math.random() * 10000)}`;

        // Set Expiry Date (2 years from now)
        // const expireDate = new Date();
        // expireDate.setFullYear(expireDate.getFullYear() + 2);

        // 4️⃣ Update MongoDB
        studentRecord.certificateId = certificateId;
        // student.expireDate = expireDate;
        // await studentRecord.save();

        // 5️⃣ Update Excel File
        updateExcelFile(studentPhone, studentEmail, certificateId);

        res.status(200).json({
            message: "Course Completed Successfully. Certificate Issued!",
            certificateId: certificateId,
            // expireDate: expireDate.toISOString().split("T")[0],
            studentName: studentRecord.studentName,
            studentCourseName: studentRecord.studentCourseName
        });

        console.log("✅ Certificate Issued & Excel Updated");

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateStudent = async (req, res) => {
    const { studentPhone, updates } = req.body;
    console.log("Received phone number:", studentPhone);
    console.log("Updates received:", updates);
    try {
        //     const student = await Student.findOneAndUpdate(
        //         { studentPhone },
        //     {$set:updates},
        // {new:true});
        //     if (!student) {
        //         return res.status(404).json({ message: "Student not found" });
        //     }
        //     // res.status(200).json({studentDetails:student});


        //     res.status(200).json({ message: "Student Details Updated Successfully", student});

        const filePath = "student_template.xlsx";

        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: "Excel file not found!" });
        }

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let data = XLSX.utils.sheet_to_json(worksheet);

        // ✅ Find the student in the Excel sheet and update their details
        let studentUpdated = false;
        data = data.map((student) => {
            if (String(student.studentPhone) === String(studentPhone)) {
                studentUpdated = true;
                return { ...student, ...updates }; // Merge existing student details with updates
            }
            return student;
        });

        if (!studentUpdated) {
            return res.status(404).json({ message: "Student not found in Excel" });
        }

        // Convert JSON back to sheet and save the file
        const newSheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;
        XLSX.writeFile(workbook, filePath);

        res.status(200).json({ message: "Student Details Updated Successfully in MongoDB & Excel", data });
        console.log("✅ Student Details Updated in MongoDB & Excel");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getStudent = async (req, res) => {
    const { studentPhone } = req.params;

    try {
        // Load the Excel file
        const filePath = "student_template.xlsx";
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Search for student (convert phone number to string for comparison)
        const student = data.find(student => String(student.studentPhone) === String(studentPhone));

        if (!student) {
            return res.status(404).json({ message: "Student not found in Excel" });
        }

        res.status(200).json(student); // Return student details
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteStudent = async (req, res) => {
    const { studentPhone } = req.body;

    try {
        // Load the Excel file
        const filePath = "student_template.xlsx";
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        let data = XLSX.utils.sheet_to_json(worksheet);

        // Filter out the student
        const newData = data.filter(student => String(student.studentPhone) !== String(studentPhone));

        if (data.length === newData.length) {
            return res.status(404).json({ message: "Student not found in Excel" });
        }

        // Convert JSON back to sheet & save
        const newWorksheet = XLSX.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = newWorksheet;
        XLSX.writeFile(workbook, filePath);

        res.status(200).json({ message: "Student Deleted Successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const verifyCertificate = async (req, res) => {
    const { certificateId } = req.body;
    try {
        const workbook = XLSX.readFile("student_template.xlsx"); // Load the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON

        console.log("🔥 Excel Data Loaded:", data); // <-- Add this line

        // Find student in the Excel file
        let studentRecord = data.find(student => student.certificateId === certificateId);

        console.log("🔍 Searching for:", { certificateId });

        if (!studentRecord) {
            console.log("❌ Student Certificate is not Found in Excel!");  // <-- Add this line
            return res.status(404).json({ message: "Student Certificate is not Found in Excel!" });
        }

        if (studentRecord.studentCourseCompleted === "FALSE") {
            return res.status(200).json({ message: "Student Course Not Completed" });
        }

        res.status(200).json({
            message: "Certificate Verified",
            certificateId: studentRecord.certificateId,
            studentName: studentRecord.studentName,
            courseName: studentRecord.studentCourseName,
            // expireDate: student.expireDate.toISOString().split('T')[0]
        });

        // const student = await Student.findOne({ certificateId });
        // if (!student) {
        //     return res.status(404).json({ message: "Invalid CertificateId" });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { studentLogin, verifyCertificate, studentRegister, updateStudent, getStudent,deleteStudent };