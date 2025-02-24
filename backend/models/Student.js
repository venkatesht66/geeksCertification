const mongoose = require('mongoose'); 

const studentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:true
    },
    studentEmail:{
        type:String,
        required:true,
        unique:true
    },
    studentPhone:{
        type:Number,
        required:true,
        unique:true
    },
    studentCourseName:{
        type:String,
        required:true,
    },
    studentCourseCompleted:{
        type:Boolean,
        required:true,
    },
    certificateId:{
        type:String,
        unique:true,
        sparse:true
    },
    expireDate:{
        type:Date
    }
})

const Student = mongoose.model('Student',studentSchema);

module.exports = Student;