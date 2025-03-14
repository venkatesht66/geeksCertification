const mongoose = require('mongoose');

const CourseStudentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, unique: true },
    studentPhone: { type: String, required: true },
    studentCourseName: { type: String, required: true },
    studentCourseCompleted: { type: Boolean, default: false },
    certificateId: { type: String, default: null }
});

module.exports = mongoose.model('CourseStudent', CourseStudentSchema);