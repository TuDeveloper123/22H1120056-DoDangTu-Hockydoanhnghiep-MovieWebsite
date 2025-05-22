const bookingModel = require("../../models/bookingModel");

    const checkInTicketController = async (req, res) => {
        try {
            const { bookingId } = req.body; // Hoặc nhận ticketCode tùy cách bạn muốn check-in

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


            // Cập nhật trạng thái
            booking.bookingStatus = 'checked-in';
            const updatedBooking = await booking.save();

            res.json({
                message: `Check-in thành công cho vé ${updatedBooking.ticketCode}`,
                data: updatedBooking,
                success: true,
                error: false
            });
        } catch (err) {
            res.status(400).json({
                message: err.message || err,
                error: true,
                success: false
            });
        }
    };

    module.exports = checkInTicketController;