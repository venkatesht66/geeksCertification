const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/verify-certificate', studentController.verifyCertificate);
router.post('/course-login',studentController.studentLogin);
router.post('/internship-login',studentController.internshipCompletion);

module.exports = router;