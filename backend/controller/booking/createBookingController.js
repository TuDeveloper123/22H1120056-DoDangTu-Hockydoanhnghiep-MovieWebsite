const bookingModel = require('../../models/bookingModel');
const productModel = require('../../models/productModel');
const crypto = require('crypto');

const createBookingController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const { movieId, seats, showtime = "19:00", concessions, totalAmount } = req.body;

        if (!movieId || !seats || !Array.isArray(seats) || seats.length === 0 || !totalAmount) { // Kiểm tra seats là mảng
            throw new Error("Thông tin đặt vé không đầy đủ hoặc không hợp lệ.");
        }

        if (seats.length > 3) {
             throw new Error("Chỉ được chọn tối đa 3 ghế.");
        }

        // Kiểm tra xem phim có tồn tại và có đang chiếu/chiếu sớm không
        const movie = await productModel.findById(movieId);
        if (!movie) {
            throw new Error("Không tìm thấy phim.");
        }
        if (!['showing', 'early_access'].includes(movie.status)) {
             throw new Error("Phim này hiện không bán vé.");
        }

        // *** Thêm kiểm tra ghế trùng lặp ***
        const existingBooking = await bookingModel.findOne({
            movieId: movieId,
            showtime: showtime,
            bookingStatus: { $ne: 'cancelled' }, // Chỉ kiểm tra vé chưa hủy
            seats: { $in: seats } // Kiểm tra xem có ghế nào trong list mới đã tồn tại chưa
        });

        if (existingBooking) {
            // Tìm chính xác ghế nào đã bị đặt trong list gửi lên
            const alreadyBookedSeats = seats.filter(seat => existingBooking.seats.includes(seat));
            // Chỉ throw lỗi nếu có ghế trùng lặp thực sự trong danh sách gửi lên
            if (alreadyBookedSeats.length > 0) {
                throw new Error(`Ghế ${alreadyBookedSeats.join(', ')} đã có người đặt cho suất chiếu này. Vui lòng chọn lại.`);
            }
        }
        // *** Kết thúc kiểm tra ghế trùng lặp ***

        // Tạo mã vé ngẫu nhiên
        const ticketCode = crypto.randomBytes(8).toString('hex').toUpperCase();

        const newBooking = new bookingModel({
            userId: currentUserId,
            movieId: movieId,
            seats: seats, // Đảm bảo seats là một mảng
            showtime: showtime,
            concessions: concessions || { popcorn: false, drink: false }, // Đảm bảo concessions có giá trị
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
        console.error("Booking Error:", err); // Log lỗi chi tiết ở backend
        res.status(400).json({
            // Trả về message lỗi cụ thể hơn nếu có thể
            message: err.message || "Đặt vé thất bại, đã có lỗi xảy ra.",
            error: true,
            success: false
        });
    }
};

module.exports = createBookingController;