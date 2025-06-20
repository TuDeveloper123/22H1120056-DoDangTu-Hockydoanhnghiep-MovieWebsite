// File Path: backend/controllers/booking/getBookingHistoryController.js

const bookingModel = require("../../models/bookingModel");
const { isStaffOrAdmin } = require("../../helpers/permission"); // Import helper

const getBookingHistoryController = async (req, res) => {
    try {
        // Kiểm tra quyền Staff hoặc Admin
        if (!(await isStaffOrAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Staff hoặc Admin.");
        }

        // Lấy tất cả booking, populate thông tin phim và người dùng
        const bookings = await bookingModel.find({})
            .populate('userId', 'name email') // Lấy tên và email của người dùng
            .populate('movieId', 'productName') // Chỉ lấy tên phim, cinemaName đã có trong booking
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

        res.json({
            message: "Lịch sử đặt vé",
            data: bookings,
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

module.exports = getBookingHistoryController;