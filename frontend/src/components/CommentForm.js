import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa"; // Icon sao

const CommentForm = ({ movieId, fetchComments, commentToEdit = null, onCancelEdit = () => {} }) => {
    const user = useSelector(state => state?.user?.user);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0); // State cho rating
    const [hoverRating, setHoverRating] = useState(0); // State cho hover sao
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = Boolean(commentToEdit); // Kiểm tra xem có đang edit không

    useEffect(() => {
        if (isEditing) {
            setContent(commentToEdit.content);
            setRating(commentToEdit.rating || 0); // Lấy rating cũ nếu có
        } else {
            setContent('');
            setRating(0); // Reset khi thêm mới
        }
    }, [commentToEdit, isEditing]);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleStarHover = (index) => {
         setHoverRating(index + 1);
    };

    const handleStarLeave = () => {
        setHoverRating(0); // Reset hover khi chuột rời khỏi
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.info("Vui lòng đăng nhập để bình luận.");
            return;
        }
        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận.");
            return;
        }
         if (rating === 0 && !isEditing) { // Có thể bỏ check này nếu rating không bắt buộc
             toast.error("Vui lòng chọn đánh giá (số sao).");
             return;
         }

        setIsSubmitting(true);

        const payload = { content, rating }; // Luôn gửi cả rating
        let url = '';
        let method = '';

        if (isEditing) {
            url = `${SummaryApi.editComment.url}/${commentToEdit._id}`;
            method = SummaryApi.editComment.method;
        } else {
            url = SummaryApi.addComment.url;
            method = SummaryApi.addComment.method;
            payload.movieId = movieId; // Thêm movieId khi tạo mới
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include', // Gửi cookie token
                body: JSON.stringify(payload)
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                toast.success(dataResponse.message);
                setContent('');
                setRating(0); // Reset form
                fetchComments(); // Tải lại danh sách bình luận
                if (isEditing) {
                    onCancelEdit(); // Đóng form edit
                }
            } else {
                toast.error(dataResponse.message || "Có lỗi xảy ra.");
            }

        } catch (error) {
            toast.error("Lỗi kết nối.");
            console.error("Comment submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 mt-4 p-4 border rounded-lg bg-white shadow">
            <h3 className="text-lg font-semibold mb-3">{isEditing ? 'Chỉnh sửa bình luận' : 'Viết bình luận của bạn'}</h3>
            {/* Phần chọn sao */}
            <div className="flex items-center mb-3">
                <span className="mr-2 text-gray-700">Đánh giá:</span>
                <div className="flex" onMouseLeave={handleStarLeave}>
                    {[...Array(10)].map((_, index) => (
                        <FaStar
                            key={index}
                            size={22}
                            className={`cursor-pointer transition-colors duration-150 ${
                                (hoverRating || rating) > index ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => handleStarClick(index)}
                            onMouseEnter={() => handleStarHover(index)}
                        />
                    ))}
                </div>
                {rating > 0 && <span className="ml-2 font-semibold text-yellow-500">{rating}/10</span>}
            </div>
            {/* Phần nhập nội dung */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-300 mb-3"
                rows="3"
                maxLength={1000} // Đồng bộ với backend nếu có
                disabled={isSubmitting}
            ></textarea>
            <div className="flex justify-end gap-2">
                 {isEditing && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting || (!isEditing && !content.trim())} // Disable nếu đang gửi hoặc nội dung rỗng (khi thêm mới)
                >
                    {isSubmitting ? 'Đang gửi...' : (isEditing ? 'Lưu thay đổi' : 'Gửi bình luận')}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;