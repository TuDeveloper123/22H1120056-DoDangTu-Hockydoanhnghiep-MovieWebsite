import React from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import UpdatePasswordForm from '../components/UpdatePasswordForm';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    // Nếu không có user, chuyển hướng về trang login
    if (!user) {
        navigate("/login");
        return null; // Không render gì cả trong khi chuyển hướng
    }

    return (
        <div className="container mx-auto p-4 md:p-6 min-h-[calc(100vh-120px)]">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Tài khoản của tôi</h1>

            {/* Phần thông tin cá nhân */}
            <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 mb-8 lg:max-w-2xl mx-auto flex items-center gap-4">
                <div className="relative">
                    {user?.profilePic ? (
                        <img src={user.profilePic} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-red-200" />
                    ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full">
                            <FaRegCircleUser size={40} className="text-gray-400" />
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            {/* Phần đổi mật khẩu */}
            <UpdatePasswordForm />
        </div>
    );
};

export default MyAccount;