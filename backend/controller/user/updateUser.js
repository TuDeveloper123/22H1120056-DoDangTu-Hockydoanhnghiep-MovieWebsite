// File Path: backend/controllers/user/updateUser.js

const userModel = require("../../models/userModel");
const { isAdmin } = require("../../helpers/permission"); // Import helper

async function updateUser(req, res) {
    try {
        // Kiểm tra quyền ADMIN
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const { userId, email, name, role } = req.body;

        const payload = {
            ...(email && { email: email }),
            ...(name && { name: name }),
            ...(role && { role: role }),
        };

        const updatedUser = await userModel.findByIdAndUpdate(userId, payload);

        res.json({
            data: updatedUser,
            message: "Chỉnh sửa người dùng thành công",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(403).json({ // Dùng 403 Forbidden cho lỗi quyền
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateUser;