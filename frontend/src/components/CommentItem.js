import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/vi';
import defaultAvatar from '../assets/signin.gif'; // Ảnh avatar mặc định
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import CommentForm from './CommentForm'; // Import form để edit

moment.locale('vi');

const CommentItem = ({ comment, fetchComments }) => {
    const currentUser = useSelector(state => state?.user?.user);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const canEdit = currentUser && currentUser._id === comment.userId?._id;
    const canDelete = currentUser && (currentUser._id === comment.userId?._id || currentUser.role === 'ADMIN');

    const handleDelete = async () => {
        if (isDeleting) return;
         if (window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
            setIsDeleting(true);
            try {
                const response = await fetch(`${SummaryApi.deleteComment.url}/${comment._id}`, {
                    method: SummaryApi.deleteComment.method,
                    credentials: 'include',
                });
                const dataResponse = await response.json();
                if (dataResponse.success) {
                    toast.success("Xóa bình luận thành công.");
                    fetchComments(); // Tải lại list
                } else {
                    toast.error(dataResponse.message || "Xóa thất bại.");
                }
            } catch (error) {
                toast.error("Lỗi kết nối khi xóa.");
            } finally {
                setIsDeleting(false);
            }
         }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex gap-3 py-4 border-b last:border-b-0">
            {/* Avatar */}
            <img
                src={comment.userId?.profilePic || defaultAvatar}
                alt={comment.userId?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
            />
            {/* Comment Content */}
            <div className="flex-grow">
                {isEditing ? (
                    <CommentForm
                        movieId={comment.movieId} // Cần truyền movieId cho form edit (dù ko dùng)
                        fetchComments={fetchComments}
                        commentToEdit={comment}
                        onCancelEdit={handleCancelEdit}
                    />
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.userId?.name || 'Người dùng ẩn danh'}</span>
                            {/* Rating */}
                            {comment.rating > 0 && (
                                <span className="flex items-center text-yellow-400">
                                    <FaStar size={14} className="mr-0.5"/>
                                    <span className="font-bold text-sm">{comment.rating}</span>
                                </span>
                            )}
                            <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
                        </div>
                        {/* Nội dung */}
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                        {/* Actions (Edit/Delete) */}
                        <div className="flex items-center gap-3 mt-2">
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <FaEdit /> Sửa
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className={`text-xs text-red-600 hover:underline flex items-center gap-1 ${isDeleting ? 'opacity-50' : ''}`}
                                    disabled={isDeleting}
                                >
                                     {isDeleting ? 'Đang xóa...' : <><FaTrash /> Xóa</>}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CommentItem;