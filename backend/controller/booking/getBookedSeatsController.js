const bookingModel = require("../../models/bookingModel");

const getBookedSeatsController = async (req, res) => {
    try {
        const { movieId, showtime } = req.params;

        if (!movieId || !showtime) {
            return res.status(400).json({ message: "Thiếu thông tin phim hoặc suất chiếu." });
        }

        // Tìm tất cả các booking cho phim và suất chiếu đó mà chưa bị hủy
        const bookings = await bookingModel.find({
            movieId: movieId,
            showtime: showtime,
            bookingStatus: { $ne: 'cancelled' } // Chỉ lấy vé chưa bị hủy
        }).select('seats'); // Chỉ lấy trường seats

        // Gộp tất cả các mảng seats thành một mảng duy nhất
        const bookedSeats = bookings.reduce((acc, booking) => {
            return acc.concat(booking.seats);
        }, []);

        res.json({
            message: "Lấy danh sách ghế đã đặt thành công.",
            data: bookedSeats, // Mảng các chuỗi ghế, ví dụ: ["A01", "B05", "A02"]
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