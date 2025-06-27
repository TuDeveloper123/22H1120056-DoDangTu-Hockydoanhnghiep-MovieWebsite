const userModel = require("../../models/userModel");
const { isAdmin } = require("../../helpers/permission");

const deleteUserController = async (req, res) => {
    try {
        // 1. Kiểm tra quyền Admin
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        // Lấy userId cần xóa từ body của request
        const { userId: userIdToDelete } = req.body;

        if (!userIdToDelete) {
            throw new Error("Thiếu ID của người dùng cần xóa.");
        }

        // 2. Không cho phép Admin tự xóa tài khoản của chính mình
        if (userIdToDelete === req.userId) {
            throw new Error("Bạn không thể tự xóa tài khoản của chính mình.");
        }

        // 3. Tìm và xóa người dùng
        const user = await userModel.findById(userIdToDelete);

        if (!user) {
            throw new Error("Không tìm thấy người dùng để xóa.");
        }

        await userModel.findByIdAndDelete(userIdToDelete);

        res.json({
            message: `Xóa người dùng '${user.name}' thành công!`,
            success: true,
            error: false
        });

    } catch (err) {
        // Phân loại mã lỗi để trả về cho client
        let statusCode = 400; // Bad Request
        if (err.message.includes("Yêu cầu bị từ chối")) {
            statusCode = 403; // Forbidden
        }

        res.status(statusCode).json({
            message: err.message || "Xóa người dùng thất bại.",
            error: true,
            success: false
        });
    }
};

module.exports = deleteUserController;