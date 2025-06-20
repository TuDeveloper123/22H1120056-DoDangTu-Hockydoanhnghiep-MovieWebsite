const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');

async function updatePasswordController(req, res) {
    try {
        const userId = req.userId; // Lấy từ middleware authToken
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new Error("Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.");
        }

        // Tìm người dùng
        const user = await userModel.findById(userId);
        if (!user) {
            // Trường hợp này không nên xảy ra nếu authToken hoạt động đúng
            throw new Error("Không tìm thấy người dùng.");
        }

        // Xác thực mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu cũ không chính xác.");
        }

        // Hash mật khẩu mới
        const salt = bcrypt.genSaltSync(10);
        const hashNewPassword = await bcrypt.hashSync(newPassword, salt);

        // Cập nhật mật khẩu của người dùng
        user.password = hashNewPassword;
        await user.save();

        res.json({
            message: "Cập nhật mật khẩu thành công!",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Cập nhật mật khẩu thất bại.",
            error: true,
            success: false
        });
    }
}

module.exports = updatePasswordController;