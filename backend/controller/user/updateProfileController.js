const userModel = require("../../models/userModel");

async function updateProfileController(req, res) {
    try {
        const userId = req.userId; // Lấy từ middleware authToken

        
        const { profilePic } = req.body;

        if (!profilePic) {
            throw new Error("Không có ảnh nào được cung cấp để cập nhật.");
        }

        // Tìm và cập nhật người dùng trong CSDL
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profilePic: profilePic },
            { new: true } // Tùy chọn này để Mongoose trả về document đã được cập nhật
        ).select('-password'); // Bỏ qua trường password trong kết quả trả về

        if (!updatedUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng.",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Cập nhật ảnh đại diện thành công!",
            data: updatedUser,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Cập nhật thất bại.",
            error: true,
            success: false
        });
    }
}

module.exports = updateProfileController;