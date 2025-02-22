const studentController = require('../controllers/studentController.js');
const express = require('express');
const router = express.Router();

router.post('/admin',studentController.studentRegister);
router.get('/admin/get-all-students',studentController.getAllStudents);
router.post('/student-login',studentController.studentLogin);
// router.put('/admin/edit-student',studentController.updateStudent);
router.delete('/admin/delete-student', studentController.deleteStudent);
router.post('/student/verify',studentController.verifyCertificate);

router.get('/admin/edit-student/:studentPhone', studentController.getStudent);
router.put('/admin/edit-student', studentController.updateStudent);

module.exports = router;