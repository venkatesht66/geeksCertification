const XLSX = require("xlsx");
const Student = require('../models/Student');

const updateExcelFile = (studentPhone, certificateId, internshipCertificateId, expiryDate) => {
    const filePath = "student_template.xlsx";
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    let studentIndex = data.findIndex(student => String(student.studentPhone) === String(studentPhone));

    if (studentIndex !== -1) {
        if (certificateId) data[studentIndex].certificateId = certificateId;
        if (internshipCertificateId) data[studentIndex].internshipCertificateId = internshipCertificateId;
        if (expiryDate) data[studentIndex].expiryDate = expiryDate;
    } else {
        console.log("❌ Student not found in Excel!");
        return false;
    }

    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;
    XLSX.writeFile(workbook, filePath);

    console.log("✅ Excel Updated with Certificates!");
    return true;
};

const studentLogin = async (req, res) => {
    const { studentPhone, studentEmail } = req.body;

    try {
        let student = await Student.findOne({ studentPhone, studentEmail });
        const workbook = XLSX.readFile("student_template.xlsx");
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        let studentRecord = data.find(student => 
            String(student.studentPhone) === String(studentPhone) &&
            student.studentEmail === studentEmail
        );

        if (!student && !studentRecord) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        if (student && !studentRecord) {
            studentRecord = {
                studentPhone: student.studentPhone,
                studentEmail: student.studentEmail,
                studentName: student.studentName,
                studentCourseName: student.studentCourseName,
                studentCourseCompleted: student.studentCourseCompleted ? "TRUE" : "FALSE",
                certificateId: student.certificateId || ""
            };
            data.push(studentRecord);
        }

        if (studentRecord.studentCourseCompleted === "FALSE" || (student && !student.studentCourseCompleted)) {
            return res.status(200).json({ message: "Student Course Not Completed" });
        }

        if (studentRecord.certificateId || (student && student.certificateId)) {
            return res.status(200).json({
                message: "Course Completed Successfully",
                certificateId: studentRecord.certificateId || student.certificateId,
                studentName: studentRecord.studentName,
                studentCourseName: studentRecord.studentCourseName
            });
        }

        const coursePrefixes = {
            "Full Stack Web Development": "FSWB",
            "Gen AI": "GAI",
            "Data Science": "DS",
            "Data Analytics": "DA",
            "AWS": "AWS"
        };

        const courseCode = coursePrefixes[studentRecord.studentCourseName] || "GEN";
        const certificateId = `BL${courseCode}${Math.ceil(Math.random() * 10000)}`;

        if (student) {
            student.certificateId = certificateId;
            await student.save();
        } else {
            await Student.create({
                studentPhone,
                studentEmail,
                studentName: studentRecord.studentName,
                studentCourseName: studentRecord.studentCourseName,
                studentCourseCompleted: true,
                certificateId
            });
        }

        const isUpdated = updateExcelFile(studentPhone, certificateId, null, null);
        if (!isUpdated) {
            return res.status(500).json({ message: "Error updating Excel file!" });
        }

        res.status(200).json({
            message: "Course Completed Successfully. Certificate Issued!",
            certificateId,
            studentName: studentRecord.studentName,
            studentCourseName: studentRecord.studentCourseName
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const internshipCompletion = async (req, res) => {
    const { studentPhone, studentEmail } = req.body;

    try {
        let student = await Student.findOne({ studentPhone, studentEmail });
        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        if (student.internshipCertificateId) {
            return res.status(200).json({
                message: "Internship Already Completed",
                internshipCertificateId: student.internshipCertificateId,
                expiryDate: student.expiryDate.toISOString().split('T')[0]
            });
        }

        const uploadDate = new Date();
        const expiryDate = new Date(uploadDate);
        expiryDate.setFullYear(expiryDate.getFullYear()+1);

        const internshipCertificateId = `BLINT${Math.ceil(Math.random() * 10000)}`;
        
        student.internshipCertificateId = internshipCertificateId;
        student.expiryDate = expiryDate;
        await student.save();

        updateExcelFile(studentPhone, null, internshipCertificateId, expiryDate.toISOString().split('T')[0]);

        res.status(200).json({
            message: "Internship Completed Successfully!",
            internshipCertificateId,
            expiryDate: expiryDate.toISOString().split('T')[0]
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.body;
        if (!certificateId) {
            return res.status(400).json({ message: "Certificate ID is required!" });
        }

        let student = await Student.findOne({ 
            $or: [{ certificateId }, { internshipCertificateId: certificateId }]
        });

        if (!student) {
            return res.status(404).json({ message: "Certificate Not Found!" });
        }

        let response = {
            message: "Certificate Verified!",
            certificateId,
            studentName: student.studentName,
            courseName: student.studentCourseName
        };

        if (student.internshipCertificateId === certificateId) {
            response.internshipCertificateId = student.internshipCertificateId;
            response.expiryDate = student.expiryDate.toISOString().split('T')[0];

            const today = new Date();
            if (today > student.expiryDate){
                response.message = "Internship Certificate Expired!";
            }
        }

        res.status(200).json(response);

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { studentLogin, verifyCertificate, internshipCompletion };