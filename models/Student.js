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
        default:false
    },
    studentCourseCompleted:{
        type:Boolean,
        required:true,
        default:false
    },
    certificateId:{
        type:String,
        required:false
    },
    expireDate:{
        type:Date,
        required:false
    }
})

const Student = mongoose.model('Student',studentSchema);

module.exports = Student;