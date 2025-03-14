const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const ADMIN_CREDENTIALS = {
    email: process.env.EMAIL,
    password: bcrypt.hashSync(process.env.PASSWORD, 10),  // Hash the password for security
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (email !== ADMIN_CREDENTIALS.email) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email,role:"admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
};



const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = {adminLogin}