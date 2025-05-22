const commentModel = require('../../models/commentModel');
const userModel = require('../../models/userModel'); // Để kiểm tra role Admin

async function deleteCommentController(req, res) {
    try {
        const currentUserId = req.userId;
        const { commentId } = req.params; // Lấy commentId từ URL

        if (!commentId) {
            throw new Error("Thiếu Comment ID.");
        }

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            throw new Error("Không tìm thấy bình luận.");
        }

        // Tìm thông tin user đang thực hiện request để kiểm tra role
        const currentUser = await userModel.findById(currentUserId);
        if (!currentUser) {
             throw new Error("Không tìm thấy người dùng."); // Lỗi không mong muốn
        }

        // Kiểm tra quyền xóa: Hoặc là chủ sở hữu, hoặc là Admin
        const isOwner = comment.userId.toString() === currentUserId;
        const isAdmin = currentUser.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            throw new Error("Bạn không có quyền xóa bình luận này.");
        }

        await commentModel.findByIdAndDelete(commentId);

        res.json({
            message: "Xóa bình luận thành công!",
            success: true,
            error: false,
            data: { _id: commentId } // Trả về ID đã xóa để client xử lý UI
        });

    } catch (err) {
         res.status(400).json({
            message: err.message || "Xóa bình luận thất bại.",
            error: true,
            success: false
        });
    }
}

module.exports = deleteCommentController;