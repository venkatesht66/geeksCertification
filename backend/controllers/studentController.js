const Student = require('../models/Student');

const studentRegister = async (req, res) => {
    let { studentName, studentEmail, studentPhone, studentCourseName, studentCourseCompleted } = req.body;
    studentCourseCompleted = studentCourseCompleted === true || studentCourseCompleted === "true";

    try {
        const studentemail = await Student.findOne({ studentEmail });
        const studentphone = await Student.findOne({ studentPhone });
        if (studentemail || studentphone) {
            return res.status(400).json('Email or Phone Number Already Exists')
        }

        const newStudent = new Student({
            studentName,
            studentEmail,
            studentPhone,
            studentCourseName,
            studentCourseCompleted,
            certificateId: undefined
        });

        await newStudent.save();
        res.status(201).json({ message: "Student Registered Successfully" });
        console.log('Registered');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Interal Server Error" });
    }
}


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        res.status(200).json({
            message: "All Students Retrieved Successfully",
            students
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const studentLogin = async (req, res) => {
    const { studentEmail, studentPhone } = req.body;
    try {
        const student = await Student.findOne({ studentEmail, studentPhone });
        if (!student) {
            return res.status(404).json({ message: "Student Details Not Found" })
        }

        if ((!student.studentCourseCompleted)) {
            return res.status(200).json({ message: "Student Course Not Completed" })
        }

        if (student.certificateId && student.expireDate) {
            return res.status(200).json({
                message: "Course Completed Successfully",
                certificateId: student.certificateId,
                expireDate: student.expireDate.toISOString().split('T')[0]
            });
        }

        let certificateId;

        if (student.studentCourseName === "Full Stack Web Development") {
            certificateId = "BL" + "FSWB" + Math.ceil((Math.random() * 10000));
        } else if (student.studentCourseName === "Gen AI") {
            certificateId = "BL" + "GAI" + Math.ceil((Math.random() * 10000));
        } else if (student.studentCourseName === "Data Science") {
            certificateId = "BL" + "DS" + Math.ceil((Math.random() * 10000));
        } else if (student.studentCourseName === "Data Analytics") {
            certificateId = "BL" + "DA" + Math.ceil((Math.random() * 10000));
        } else if (student.studentCourseName === "AWS") {
            certificateId = "BL" + "AWS" + Math.ceil((Math.random() * 10000));
        }

        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 2);

        if (!student.certificateId) { 
            student.certificateId = certificateId; 
        }
        student.expireDate = expireDate;
        await student.save();

        res.status(200).json({
            message: "Course Completed Successfully. Certificate Issued!",
            certificateId: certificateId,
            expireDate: expireDate.toISOString().split('T')[0]
        });
        console.log("Certificate Issued");

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateStudent = async (req, res) => {
    const { studentPhone, updates } = req.body;
    console.log("Received phone number:", studentPhone);
    console.log("Updates received:", updates);

    try {
        const student = await Student.findOneAndUpdate(
            { studentPhone },
        {$set:updates},
    {new:true});
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // res.status(200).json({studentDetails:student});


        res.status(200).json({ message: "Student Details Updated Successfully", student});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const getStudent = async (req, res) => {
    const { studentPhone } = req.params;

    try {
        const student = await Student.findOne({ studentPhone });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteStudent = async (req, res) => {
    const { studentPhone } = req.body;
    try {
        const student = await Student.findOneAndDelete({ studentPhone });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        await Student.findOneAndDelete({ certificateId: student.certificateId });
        res.status(200).json({ message: "Student Deleted Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const verifyCertificate = async (req, res) => {
    const { certificateId } = req.body;
    try {
        const certificate = await Student.findOne({ certificateId });
        if (!certificate) {
            return res.status(404).json({ message: "Invalid CertificateId" });
        }
        res.status(200).json({
            message: "Certificate Verified",
            certificateId: certificate.certificateId,
            studentName: certificate.studentName,
            courseName: certificate.courseName,
            expireDate: certificate.expireDate.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { studentRegister, studentLogin, updateStudent, deleteStudent, verifyCertificate ,getAllStudents,getStudent};