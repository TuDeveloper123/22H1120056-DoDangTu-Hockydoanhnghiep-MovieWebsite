const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movieId: { // ID của phim được bình luận
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Tham chiếu đến productModel
        required: true,
        index: true // Index để query nhanh hơn
    },
    userId: { // ID của người bình luận
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Tham chiếu đến userModel
        required: true
    },
    content: { // Nội dung bình luận
        type: String,
        required: [true, "Nội dung bình luận không được để trống"],
        trim: true,
        maxlength: [1000, "Bình luận không được quá 1000 ký tự"] // Giới hạn độ dài nếu muốn
    },
    // --- Phần Rating giống ảnh ví dụ ---
    rating: {
         type: Number,
         min: 0, // Hoặc 1 nếu không cho phép 0 sao
         max: 10, // Hoặc 5 tùy thang điểm bạn muốn
         // required: true // Có thể bắt buộc hoặc không
    }
    // ----------------------------------
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;