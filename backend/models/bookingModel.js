const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Tham chiếu đến userModel
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Tham chiếu đến productModel (phim)
        required: true
    },
    seats: { // Danh sách ghế đã chọn
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} tối đa 3 ghế'] // Giới hạn tối đa 3 ghế
    },
    showtime: { // Suất chiếu (hiện tại cố định 19:00)
        type: String,
        required: true,
        default: "19:00"
    },
    concessions: { // Bắp nước
        popcorn: { type: Boolean, default: false },
        drink: { type: Boolean, default: false }
    },
    totalAmount: { // Tổng tiền
        type: Number,
        required: true
    },
    ticketCode: { // Mã vé random
        type: String,
        unique: true,
        required: true
    },
    bookingStatus: { // Trạng thái vé
        type: String,
        enum: ['booked', 'checked-in', 'cancelled'],
        default: 'booked'
    }
}, {
    timestamps: true
});

// Hàm validation giới hạn số lượng phần tử trong mảng seats
function arrayLimit(val) {
  return val.length <= 3;
}

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;