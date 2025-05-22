const commentModel = require('../../models/commentModel');
const productModel = require('../../models/productModel');

async function addCommentController(req, res) {
    try {
        const currentUserId = req.userId;
        const { movieId, content, rating } = req.body;

        if (!movieId || !content) {
            throw new Error("Thiếu thông tin movieId hoặc nội dung bình luận.");
        }

        // --- KIỂM TRA TRƯỚC KHI LÀM GÌ KHÁC ---
        const existingComment = await commentModel.findOne({
            movieId: movieId,
            userId: currentUserId
        });

        if (existingComment) {
            // Sử dụng mã lỗi 409 Conflict hoặc 400 Bad Request đều được
            return res.status(409).json({
                 message: "Bạn đã đánh giá phim này rồi.",
                 error: true,
                 success: false
             });
        }
        // -------------------------------------

        // Kiểm tra xem phim có tồn tại không
        const movieExists = await productModel.findById(movieId);
        if (!movieExists || movieExists.isDeleted) {
             throw new Error("Phim không tồn tại hoặc đã bị xóa.");
        }

        const newComment = new commentModel({
            movieId: movieId,
            userId: currentUserId,
            content: content,
            rating: rating // Sẽ là undefined nếu không được gửi
        });

        const savedComment = await newComment.save();

        // Populate thông tin user để trả về client hiển thị ngay
        const populatedComment = await commentModel.findById(savedComment._id)
                                              .populate('userId', 'name profilePic');

        res.status(201).json({
            message: "Thêm bình luận thành công!",
            success: true,
            error: false,
            data: populatedComment
        });

    } catch (err) {
        // Nếu lỗi không phải do đã comment (đã return ở trên), thì trả về 400
        res.status(400).json({
            message: err.message || "Thêm bình luận thất bại.",
            error: true,
            success: false
        });
    }
}

module.exports = addCommentController;