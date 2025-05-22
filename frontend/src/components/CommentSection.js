import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// *** THÊM PROP `onCountChange` VỚI GIÁ TRỊ MẶC ĐỊNH LÀ HÀM RỖNG ***
const CommentSection = ({ movieId, onCountChange = () => {} }) => {
    const currentUser = useSelector(state => state?.user?.user);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState(null);
    const [userHasCommented, setUserHasCommented] = useState(false);

    // Hàm fetch comments, dùng useCallback
    const fetchComments = useCallback(async () => {
        if (!movieId) {
            setLoadingComments(false);
            setComments([]);
            setUserHasCommented(false);
            onCountChange(0); // *** GỌI CALLBACK VỚI 0 KHI KHÔNG CÓ movieId ***
            return;
        }
        setLoadingComments(true);
        setError(null);
        try {
            const response = await fetch(`${SummaryApi.getComments.url}/${movieId}`, {
                method: SummaryApi.getComments.method,
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                const fetchedComments = dataResponse.data || [];
                setComments(fetchedComments);
                const count = fetchedComments.length;
                onCountChange(count); // *** GỌI CALLBACK VỚI SỐ LƯỢNG MỚI ***

                // Kiểm tra user đã comment chưa
                if (currentUser && count > 0) {
                    const hasCommented = fetchedComments.some(comment => comment.userId?._id === currentUser._id);
                    setUserHasCommented(hasCommented);
                } else {
                    setUserHasCommented(false);
                }
            } else {
                setError(dataResponse.message || "Không thể tải bình luận.");
                setComments([]);
                setUserHasCommented(false);
                onCountChange(0); // *** GỌI CALLBACK VỚI 0 KHI LỖI ***
            }
        } catch (err) {
            setError("Lỗi kết nối khi tải bình luận.");
            setComments([]);
            setUserHasCommented(false);
            onCountChange(0); // *** GỌI CALLBACK VỚI 0 KHI LỖI ***
            console.error("Fetch comments error:", err);
        } finally {
            setLoadingComments(false);
        }
        // Bỏ onCountChange khỏi dependency vì nó được đảm bảo ổn định bởi useCallback ở parent
    }, [movieId, currentUser, onCountChange]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]); // fetchComments đã bao gồm movieId và currentUser

    return (
        // Thêm style nền và padding cho section
        <div className="mt-10 pt-8 pb-6 border-t border-gray-200 bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 rounded-b-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Đánh giá & Bình luận ({comments.length}) {/* Vẫn hiển thị count ở đây nếu muốn */}
            </h2>

            {/* --- Hiển thị Form hoặc Thông báo --- */}
            {!loadingComments && (
                 <>
                    {currentUser ? (
                        userHasCommented ? (
                            <p className="text-center mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
                                Bạn đã đánh giá phim này. Bạn có thể sửa hoặc xóa bình luận của mình bên dưới.
                            </p>
                        ) : (
                            // Truyền fetchComments để form có thể trigger load lại sau khi submit
                            <CommentForm movieId={movieId} fetchComments={fetchComments} />
                        )
                    ) : (
                         <p className="text-center mb-6 p-3 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-sm">
                             Vui lòng <Link to="/login" className="text-red-600 hover:underline font-medium">đăng nhập</Link> để viết bình luận.
                         </p>
                    )}
                 </>
            )}

            {/* Hiển thị Loading hoặc Error */}
            {loadingComments && <p className="text-center my-6 text-gray-500">Đang tải bình luận...</p>}
            {error && <p className="text-center my-6 text-red-500">{error}</p>}

            {/* Danh sách bình luận */}
            {!loadingComments && !error && (
                <div className="mt-8 space-y-5"> {/* Tăng khoảng cách giữa các comment */}
                    {comments.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Chưa có bình luận nào.</p>
                    ) : (
                        comments.map((comment) => (
                            // Truyền fetchComments để CommentItem có thể trigger load lại sau khi xóa/sửa
                            <CommentItem key={comment._id} comment={comment} fetchComments={fetchComments} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;