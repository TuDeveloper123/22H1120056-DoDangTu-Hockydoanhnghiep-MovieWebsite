const bookingModel = require("../../models/bookingModel");

const getMyBookingsController = async (req, res) => {
    try {
        const currentUserId = req.userId; // Lấy từ middleware authToken

        const bookings = await bookingModel.find({ userId: currentUserId })
            .populate('movieId', 'productName cinemaHall productImage showtime') // Populate thông tin cần thiết của phim
            .sort({ createdAt: -1 });

        res.json({
            message: "Lịch sử đặt vé của bạn",
            data: bookings,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi server khi lấy lịch sử đặt vé.",
            error: true,
            success: false
        });
    }
};

module.exports = getMyBookingsController;