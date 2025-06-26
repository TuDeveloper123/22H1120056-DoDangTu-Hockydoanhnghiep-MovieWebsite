// File: frontend/src/pages/MyAccount.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- IMPORT CÁC CÔNG CỤ CẦN THIẾT ---
import { FaUserCircle, FaPen } from "react-icons/fa";
import UpdatePasswordForm from '../components/UpdatePasswordForm';
import SummaryApi from '../common';
import imageTobase64 from '../helpers/imageTobase64';
import { setUserDetails } from '../store/userSlice';

const MyAccount = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- STATE MỚI ĐỂ QUẢN LÝ VIỆC CHỈNH SỬA ---
    const [isEditing, setIsEditing] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState("");
    const [loading, setLoading] = useState(false);

    // Nếu không có user, chuyển hướng về trang login
    // Đảm bảo không render gì trong khi chuyển hướng để tránh lỗi
    if (!user) {
        navigate("/login");
        return null; 
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

    // Xử lý khi người dùng chọn một ảnh mới từ máy tính
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Chuyển đổi file ảnh thành chuỗi Base64
            const imageBase64 = await imageTobase64(file);
            // Cập nhật state để hiển thị ảnh xem trước
            setNewProfilePic(imageBase64);
        }
    };

    // Xử lý khi người dùng bấm nút "Lưu thay đổi"
    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            // Gọi API để cập nhật thông tin người dùng
            const response = await fetch(SummaryApi.updateProfile.url, {
                method: SummaryApi.updateProfile.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Gửi cookie token để xác thực
                body: JSON.stringify({ profilePic: newProfilePic }) // Gửi ảnh mới đã được mã hóa
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                toast.success(dataResponse.message);
                // Cập nhật lại thông tin người dùng trong Redux store
                dispatch(setUserDetails(dataResponse.data)); 
                setIsEditing(false); // Thoát chế độ chỉnh sửa
                setNewProfilePic(""); // Reset state ảnh mới
            } else {
                toast.error(dataResponse.message || "Cập nhật thất bại.");
            }
        } catch (error) {
            toast.error("Lỗi kết nối máy chủ.");
            console.error("Update profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi người dùng bấm nút "Hủy"
    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewProfilePic("");
    };

    return (
        <div className="container mx-auto p-4 md:p-6 min-h-[calc(100vh-120px)]">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Tài khoản của tôi</h1>

            {/* --- PHẦN THÔNG TIN CÁ NHÂN VÀ CẬP NHẬT ẢNH --- */}
            <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 mb-8 lg:max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    {/* Ảnh đại diện và logic hiển thị nút edit */}
                    <div className="relative group w-20 h-20 flex-shrink-0">
                        {(newProfilePic || user?.profilePic) ? (
                            <img 
                                src={newProfilePic || user?.profilePic}
                                alt={user.name} 
                                className="w-20 h-20 rounded-full object-cover border-2 border-red-200" 
                            />
                        ) : (
                            <FaUserCircle className="w-20 h-20 text-gray-400" />
                        )}
                        {isEditing ? (
                            // Nếu đang ở chế độ chỉnh sửa, hiển thị input file chồng lên ảnh
                            <label htmlFor="upload-pic" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer text-white" title="Chọn ảnh mới">
                                <FaPen size={24} />
                                <input type="file" id="upload-pic" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            // Nếu không, hiển thị icon edit khi người dùng di chuột vào
                            <button onClick={() => setIsEditing(true)} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Thay đổi ảnh đại diện">
                                <FaPen size={24} />
                            </button>
                        )}
                    </div>
                    {/* Tên và Email của người dùng */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {/* Nút Lưu và Hủy chỉ hiển thị khi ở chế độ chỉnh sửa */}
                {isEditing && (
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleCancelEdit} 
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            disabled={loading || !newProfilePic} // Vô hiệu hóa nút nếu đang tải hoặc chưa chọn ảnh mới
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                )}
            </div>

            {/* --- PHẦN ĐỔI MẬT KHẨU (giữ nguyên) --- */}
            <UpdatePasswordForm />
        </div>
    );
};

export default MyAccount;