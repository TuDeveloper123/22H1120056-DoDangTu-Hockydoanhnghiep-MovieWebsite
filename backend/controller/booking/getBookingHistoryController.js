const bookingModel = require("../../models/bookingModel");

    const getBookingHistoryController = async (req, res) => {
        try {
            // Lấy tất cả booking, populate thông tin phim và người dùng
            const bookings = await bookingModel.find({})
                .populate('userId', 'name email') // Lấy tên và email của người dùng
                .populate('movieId', 'productName cinemaHall') // Lấy tên phim và rạp
                .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

            res.json({
                message: "Lịch sử đặt vé",
                data: bookings,
                success: true,
                error: false
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || err,
                error: true,
                success: false
            });
        }
    };

    module.exports = getBookingHistoryController;