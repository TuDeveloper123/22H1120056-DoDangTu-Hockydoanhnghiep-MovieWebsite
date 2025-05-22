const commentModel = require('../../models/commentModel');

async function editCommentController(req, res) {
    try {
        const currentUserId = req.userId;
        const { commentId } = req.params; // Lấy commentId từ URL
        const { content, rating } = req.body; // Lấy nội dung mới

        if (!commentId || (!content && rating === undefined)) { // Phải có nội dung hoặc rating mới
            throw new Error("Thiếu Comment ID hoặc nội dung/rating cần cập nhật.");
        }

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            throw new Error("Không tìm thấy bình luận.");
        }

        // Kiểm tra quyền sở hữu
        if (comment.userId.toString() !== currentUserId) {
            throw new Error("Bạn không có quyền chỉnh sửa bình luận này.");
        }

        // Cập nhật nội dung và/hoặc rating
        if (content) comment.content = content;
        if (rating !== undefined) comment.rating = rating; // Cho phép cập nhật rating

        const updatedComment = await comment.save();

        // Populate lại thông tin user
         const populatedComment = await commentModel.findById(updatedComment._id)
                                              .populate('userId', 'name profilePic');


        res.json({
            message: "Cập nhật bình luận thành công!",
            success: true,
            error: false,
            data: populatedComment
        });

    } catch (err) {
         res.status(400).json({
            message: err.message || "Cập nhật bình luận thất bại.",
            error: true,
            success: false
        });
    }
}

module.exports = editCommentController;