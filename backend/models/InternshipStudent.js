const mongoose = require('mongoose');

const InternshipStudentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, unique: true },
    studentPhone: { type: String, required: true },
    internshipName: { type: String, required: true },
    internshipCompleted: { type: Boolean, default: false },
    certificateId: { type: String, default: null }
});

module.exports = mongoose.model('InternshipStudent', InternshipStudentSchema);