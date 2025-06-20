// File Path: backend/controllers/booking/checkInTicketController.js

const bookingModel = require("../../models/bookingModel");
const { isStaffOrAdmin } = require("../../helpers/permission"); // Import helper

const checkInTicketController = async (req, res) => {
    try {
        // Kiểm tra quyền Staff hoặc Admin
        if (!(await isStaffOrAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Staff hoặc Admin.");
        }

        const { bookingId } = req.body;

        if (!bookingId) {
            throw new Error("Cần có Booking ID để check-in.");
        }

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            throw new Error("Không tìm thấy vé.");
        }

        if (booking.bookingStatus === 'checked-in') {
            throw new Error("Vé này đã được check-in.");
        }
        if (booking.bookingStatus === 'cancelled') {
            throw new Error("Vé này đã bị hủy.");
        }

        // Cập nhật trạng thái bằng findByIdAndUpdate để tránh lỗi validation với document cũ
        const updatedBooking = await bookingModel.findByIdAndUpdate(
            bookingId,
            { bookingStatus: 'checked-in' },
            { new: true } // Trả về document đã được cập nhật
        );

        res.json({
            message: `Check-in thành công cho vé ${updatedBooking.ticketCode}`,
            data: updatedBooking,
            success: true,
            error: false
        });
    } catch (err) {
        const statusCode = err.message.includes("Yêu cầu bị từ chối") ? 403 : 400;
        res.status(statusCode).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = checkInTicketController;