const bookingModel = require('../../models/bookingModel');
const productModel = require('../../models/productModel');
const crypto = require('crypto');

const createBookingController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        // Thêm cinemaName vào request body
        const { movieId, cinemaName, seats, showtime, concessions, totalAmount } = req.body;

        if (!movieId || !cinemaName || !seats || !Array.isArray(seats) || seats.length === 0 || !totalAmount || !showtime) {
            throw new Error("Thông tin đặt vé không đầy đủ hoặc không hợp lệ.");
        }

        if (seats.length > 3) {
             throw new Error("Chỉ được chọn tối đa 3 ghế.");
        }

        const movie = await productModel.findById(movieId);
        if (!movie) {
            throw new Error("Không tìm thấy phim.");
        }
        if (!['showing', 'early_access'].includes(movie.status)) {
             throw new Error("Phim này hiện không bán vé.");
        }

        const existingBooking = await bookingModel.findOne({
            movieId: movieId,
            cinemaName: cinemaName, // Thêm điều kiện lọc theo rạp
            showtime: showtime,
            bookingStatus: { $ne: 'cancelled' },
            seats: { $in: seats }
        });

        if (existingBooking) {
            const alreadyBookedSeats = seats.filter(seat => existingBooking.seats.includes(seat));
            if (alreadyBookedSeats.length > 0) {
                throw new Error(`Ghế ${alreadyBookedSeats.join(', ')} đã có người đặt cho suất chiếu này. Vui lòng chọn lại.`);
            }
        }

        const ticketCode = crypto.randomBytes(8).toString('hex').toUpperCase();

        const newBooking = new bookingModel({
            userId: currentUserId,
            movieId: movieId,
            cinemaName: cinemaName, // Lưu tên rạp
            seats: seats,
            showtime: showtime,
            concessions: concessions || { popcorn: false, drink: false },
            totalAmount: totalAmount,
            ticketCode: ticketCode,
            bookingStatus: 'booked'
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            message: "Đặt vé thành công!",
            success: true,
            error: false,
            data: savedBooking
        });

    } catch (err) {
        console.error("Booking Error:", err);
        res.status(400).json({
            message: err.message || "Đặt vé thất bại, đã có lỗi xảy ra.",
            error: true,
            success: false
        });
    }
};

module.exports = createBookingController;