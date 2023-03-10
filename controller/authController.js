const db = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const Student = db.student;


module.exports = {
    register: async (req, res) => {
        const { name, email, password, course, intake, gender, mobile, academicStatus, passingYear } = req.body;
        const existingUser = await Student.findOne({ where: { email: email } });
        if (existingUser === null) {
            return bcrypt.hash(password, 11, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const newUser = { name, email, password: hash, course, intake, mobile, gender, academicStatus, passingYear };
                    Student.create(newUser)
                        .then((user) => {
                            res.status(201).json({
                                message: "student created successfully",
                                student: {
                                    email: user.email,
                                },
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(400).json({
                                message: "server error occurd",
                            });
                        });
                };
            });
        } else {
            res.status(400).json({
                message: "student already registered",
            });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body)
        const student = await Student.findOne({ where: { email: email } });
        if (student === null) {
            res.status(404).json({
                message: "User Not Found",
            });
        } else {
            bcrypt.compare(password, student.password, (err, result) => {
                console.log(err, result)
                if (err) {
                    console.log(err);
                } else {
                    if (!result) {
                        res.status(204).json({
                            message: "Password Not Matched",
                        });
                    } else {
                        const userData = {
                            id: student.id,
                            email: student.email,
                        };
                        const token = jwt.sign(userData, process.env.SECRET, {
                            expiresIn: "1d",
                        });
                        res.status(200).json({
                            message: "Login Successfully",
                            token,
                        });
                    };
                };
            });
        };
    },
    loggedInStudent: async (req, res) => {
        const { email } = req.user;
        const student = await Student.findOne({
            where: { email: email },
            attributes: ["id", "email", "name", "role", "status"],
        });
        res.status(200).json(student)
    },
    updateById: async (req, res) => {
        const id = req.params.id;
        const updatedStudent = await Student.update(req.body, { where: { id: id } });
        if (updatedStudent[0] > 0) {
            res.status(200).json({
                message: "Updated Successfully",
            });
        } else {
            res.status(404).json({
                message: "Student Not Found",
            });
        };
    },
    deleteById: async (req, res) => {
        const id = req.params.id;
        const deletedStudent = await Student.destroy({ where: { id: id } });
        if (deletedStudent > 0) {
            res.status(200).json({
                message: "Student Deleted Successfully",
            });
        } else {
            res.status(404).json({
                message: "Student Not Found",
            });
        };
    },
    changePassword: async (req, res) => {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;
        try {
            const existingUser = await Student.findOne({ id: id });
            bcrypt.compare(currentPassword, existingUser.password, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        message: 'Server Side Error'
                    })
                } else {
                    if (!result) {
                        return res.status(400).json({
                            message: 'Current Passsword Not Matched!'
                        })
                    }else{
                        bcrypt.hash(newPassword, 11, (err, hash) => {
                            if (!err) {
                                Student.update({ password: hash }, { where: { id: id } })
                                    .then(result => {
                                        console.log(result);
                                        res.status(200).json({
                                            message: "Password change Successfully",
                                        });
                                    })
                                    .catch(err => console.log(err))
                            } else {
                                console.log(err)
                            }
                        })
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    forgotPassword: async (req, res) => {
        const email = req.params.email;
        const student = await Student.findOne({ where: { email: email } });
        if (student !== null) {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailOptions = {
                from: 'BIMTIAN <noreply@bimtian.org>',
                to: email,
                subject: 'Password Reset Request',
                text: 'That was easy!',
                html: `
                <p>Please Visit on below Link to Change Password</p><br>
                <a href="http://localhost:3000/forgotPasss/${student.id}/reset">Reset Password</a>
                `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({
                        message: 'Email Sent on Registered Email'
                    })
                }
            });
        } else {
            res.status(400).json({
                message: 'Student Not Found'
            })
        }
    },
    resetPassword: async (req, res) => {
        const id = req.params.id;
        const password = req.body.password;
        bcrypt.hash(password, 11, (err, hash) => {
            if (!err) {
                Student.update({ password: hash }, { where: { id: id } })
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: "Password Reset Successfully",
                        });
                    })
                    .catch(err => console.log(err))
            } else {
                console.log(err)
            }
        })
    }
};