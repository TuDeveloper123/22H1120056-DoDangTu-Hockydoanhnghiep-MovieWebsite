const bookingModel = require("../../models/bookingModel");

    const getPendingTicketsController = async (req, res) => {
        try {
            // Lấy các vé chưa check-in
            const pendingTickets = await bookingModel.find({ bookingStatus: 'booked' })
                .populate('userId', 'name') // Lấy tên người dùng
                .populate('movieId', 'productName cinemaHall') // Lấy tên phim và rạp
                .sort({ createdAt: 1 }); // Sắp xếp cũ nhất lên đầu hoặc theo thời gian suất chiếu

            res.json({
                message: "Vé chờ check-in",
                data: pendingTickets,
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

    module.exports = getPendingTicketsController;