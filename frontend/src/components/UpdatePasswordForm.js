import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const UpdatePasswordForm = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
            toast.error("Vui lòng điền đầy đủ các trường.");
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword.length < 4) {
            toast.error("Mật khẩu mới phải có ít nhất 4 ký tự.");
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(SummaryApi.updatePassword.url, {
                method: SummaryApi.updatePassword.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                })
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                toast.success(dataResponse.message);
                setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Xóa form
                navigate('/');
            } else {
                toast.error(dataResponse.message || "Cập nhật mật khẩu thất bại.");
            }
        } catch (error) {
            toast.error("Lỗi kết nối máy chủ.");
            console.error("Update password error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-5 md:p-6 lg:max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="oldPassword">
                        Mật khẩu cũ
                    </label>
                    <div className="relative">
                        <input
                            type={showOldPassword ? "text" : "password"}
                            id="oldPassword"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleOnChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                            required
                        />
                        <button
                            type="button"
                            aria-label="Toggle old password visibility"
                            className="absolute inset-y-0 right-0 px-3 text-gray-500"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                        Mật khẩu mới
                    </label>
                     <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleOnChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                            required
                        />
                         <button
                            type="button"
                            aria-label="Toggle new password visibility"
                            className="absolute inset-y-0 right-0 px-3 text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmNewPassword">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleOnChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePasswordForm;