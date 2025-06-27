const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    cinemaName: { // <-- THÊM TRƯỜNG MỚI
        type: String,
        required: true,
        trim: true
    },
    seats: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} tối đa 4 ghế']
    },
    showtime: {
        type: String,
        required: true,
    },
    concessions: {
        popcorn: { type: Boolean, default: false },
        drink: { type: Boolean, default: false }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    ticketCode: {
        type: String,
        unique: true,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['booked', 'checked-in', 'cancelled'],
        default: 'booked'
    }
}, {
    timestamps: true
});

function arrayLimit(val) {
  return val.length <= 4;
}

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;