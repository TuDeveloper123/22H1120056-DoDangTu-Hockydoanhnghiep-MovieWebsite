// File Path: backend/controllers/user/allUsers.js

const userModel = require("../../models/userModel");
const { isAdmin } = require("../../helpers/permission"); // Import helper

async function allUsers(req, res) {
    try {
        // Kiểm tra quyền ADMIN
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        console.log("userid all Users", req.userId);

        const allUsers = await userModel.find();

        res.json({
            message: "All User",
            data: allUsers,
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

module.exports = allUsers;