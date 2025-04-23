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
    const data = req.body;
    const paymentData = {
      room_allocation_id: data.room_allocation_id,
      amount: data.amount,
      payment_date: data.payment_date || new Date(),
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      created_by: req.user.id,
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

const getPaymentByRoomAllocation = async (req, res) => {
  try {
    const roomAllocationId = req.params.roomAllocationId;
    const payment = await paymentService.getPaymentByRoomAllocation(
      roomAllocationId
    );
    res.json(payment);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByStudent,
  getPaymentByRoomAllocation,
};
