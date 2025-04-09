const paymentService = require("../services/paymentServices");

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      created_by: req.user.id,
      payment_date: req.body.payment_date || new Date(),
    };
    const payment = await paymentService.createPayment(paymentData);
    res.status(201).json(payment);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const payment = await paymentService.updatePayment(
      req.params.id,
      updateData
    );
    res.json(payment);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const result = await paymentService.deletePayment(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByStudent(
      req.params.studentId
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByStudent,
};
