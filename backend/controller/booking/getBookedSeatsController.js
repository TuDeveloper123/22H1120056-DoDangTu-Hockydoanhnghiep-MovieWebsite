const bookingModel = require("../../models/bookingModel");

const getBookedSeatsController = async (req, res) => {
    try {
        // Nhận thêm cinemaName từ params
        const { movieId, cinemaName, showtime } = req.params;

        if (!movieId || !cinemaName || !showtime) {
            return res.status(400).json({ message: "Thiếu thông tin phim, rạp hoặc suất chiếu." });
        }

        const bookings = await bookingModel.find({
            movieId: movieId,
            cinemaName: decodeURIComponent(cinemaName), // Giải mã cinemaName
            showtime: decodeURIComponent(showtime),     // Giải mã showtime
            bookingStatus: { $ne: 'cancelled' }
        }).select('seats');

        const bookedSeats = bookings.reduce((acc, booking) => {
            return acc.concat(booking.seats);
        }, []);

        res.json({
            message: "Lấy danh sách ghế đã đặt thành công.",
            data: bookedSeats,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi server khi lấy ghế đã đặt.",
            error: true,
            success: false
        });
    }
};

module.exports = getBookedSeatsController;