// File Path: backend/controllers/booking/getPendingTicketsController.js

const bookingModel = require("../../models/bookingModel");
const { isStaffOrAdmin } = require("../../helpers/permission"); // Import helper

const getPendingTicketsController = async (req, res) => {
    try {
        // Kiểm tra quyền Staff hoặc Admin
        if (!(await isStaffOrAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Staff hoặc Admin.");
        }

        // Lấy các vé chưa check-in
        const pendingTickets = await bookingModel.find({ bookingStatus: 'booked' })
            .populate('userId', 'name') // Lấy tên người dùng
            .populate('movieId', 'productName') // Chỉ lấy tên phim, cinemaName đã có trong booking
            .sort({ createdAt: 1 }); // Sắp xếp cũ nhất lên đầu

        res.json({
            message: "Vé chờ check-in",
            data: pendingTickets,
            success: true,
            error: false
        });
    } catch (err) {
        const statusCode = err.message.includes("Yêu cầu bị từ chối") ? 403 : 500;
        res.status(statusCode).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getPendingTicketsController;