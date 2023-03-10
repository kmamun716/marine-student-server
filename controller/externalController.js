const db = require("../model");

const Employment = db.employment_info;
const Others = db.others_info;

module.exports = {
  addEmployment: async (req, res) => {
    const student = req.user;
    const employemnt = {
      studentId: student.id,
      ...req.body,
    };
    const details = await Employment.create(employemnt);
    res.status(201).json(details);
  },
  editEmployment: async (req, res) => {
    const { id } = req.params;
    const result = await Employment.update(req.body, {
      where: { id: id },
    });
    if (result[0] > 0) {
      res.status(201).json({
        message: "Updated Successfully",
      });
    } else {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  },
  deleteEmployment: async (req, res) => {
    const { id } = req.params;
    const result = await Employment.destroy({ where: { id: id } });
    if (result > 0) {
      return res.status(200).json({
        message: 'Successfully Deleted'
      })
    } else {
      res.status(400).json({
        message: 'Not Found'
      })
    }
  },
  addOthers: async (req, res) => {
    const student = req.user;
    const others = {
      studentId: student.id,
      ...req.body,
    };
    const exists = await Others.findOne({ where: { studentId: student.id } });
    if (exists !== null) {
      return res.status(400).json({
        message: "Others Details Already Added",
      });
    } else {
      const details = await Others.create(others);
      res.status(201).json(details);
    }
  },
  editOthers: async (req, res) => {
    const { id } = req.user;
    const result = await Others.update(req.body, {
      where: { studentId: id },
    });
    if (result[0] > 0) {
      res.status(201).json({
        message: "Updated Successfully",
      });
    } else {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  },
};
