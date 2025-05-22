const commentModel = require('../../models/commentModel');

async function getCommentsByMovieController(req, res) {
    try {
        const { movieId } = req.params; // Lấy movieId từ URL

        if (!movieId) {
            throw new Error("Thiếu Movie ID");
        }

        const comments = await commentModel.find({ movieId: movieId })
                                         .populate('userId', 'name profilePic') // Lấy tên và avatar user
                                         .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

        res.json({
            message: "Lấy bình luận thành công",
            data: comments,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi server khi lấy bình luận.",
            error: true,
            success: false
        });
    }
}

module.exports = getCommentsByMovieController;