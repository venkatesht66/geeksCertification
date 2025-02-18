const studentController = require('../controllers/studentController.js');
const express = require('express');
const router = express.Router();

router.post('/admin',studentController.studentRegister);
router.post('/studentLogin',studentController.studentLogin);
router.put('/admin/edit-student',studentController.updateStudent);
router.delete('/admin/delete-student',studentController.deleteStudent);

module.exports = router;