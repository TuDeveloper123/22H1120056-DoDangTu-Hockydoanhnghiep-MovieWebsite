import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBars, FaTimes } from "react-icons/fa"; // Giữ lại FaBars, FaTimes từ /fa
import { FaRegCircleUser } from "react-icons/fa6"; // Import FaRegCircleUser từ /fa6
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (user && user?.role !== ROLE.ADMIN) { navigate("/"); }
        // else if (!user && location.pathname.startsWith('/admin-panel')) { navigate("/login"); }
    }, [user, navigate, location.pathname]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    if (!user || user?.role !== ROLE.ADMIN) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
                {/* Ví dụ: <CgSpinner size={40} className="animate-spin text-red-600" /> */}
            </div>
        );
    }

    const navLinks = [
        { to: "all-users", label: "Tất cả người dùng" },
        { to: "all-products", label: "Quản lý phim" },
        { to: "booking-history", label: "Lịch sử đặt vé" },
        { to: "ticket-status", label: "Quản lý Check-in" },
        { to: "deleted-movies", label: "Phim đã xóa" },
    ];

    const activeStyle = "bg-red-100 text-red-700 border-r-4 border-red-500 font-semibold"; // Thêm font-semibold
    const defaultStyle = "text-gray-600 hover:bg-gray-100 hover:text-gray-800";

    return (
        <div className='min-h-[calc(100vh-120px)] flex bg-gray-100'>
            {/* Nút Mobile Menu */}
            <button
                className="md:hidden fixed top-[70px] left-3 z-30 p-2.5 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
            >
                {sidebarOpen ? <FaTimes size={18}/> : <FaBars size={18}/>}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-20 bg-white min-h-full w-64 customShadow transform ${
                    sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                } md:translate-x-0 md:static md:shadow-lg md:w-60 transition-transform duration-300 ease-in-out`}
            >
                <div className="md:hidden flex justify-end p-3">
                     <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                         <FaTimes size={20}/>
                     </button>
                </div>
                <div className='h-36 flex justify-center items-center flex-col border-b border-gray-200 p-4'>
                    <div className='cursor-pointer relative flex justify-center mb-2.5'> {/* Bỏ text-5xl nếu dùng ảnh/icon custom */}
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full object-cover border-2 border-red-100 shadow-sm' alt={user?.name} />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                <FaRegCircleUser size={40}/> {/* Icon này đã được import đúng */}
                            </div>
                        )}
                    </div>
                    <p className='capitalize text-base font-semibold text-gray-800 truncate w-full text-center'>{user?.name}</p>
                    <p className='text-xs text-white bg-red-500 px-2.5 py-0.5 rounded-full mt-1.5 font-medium tracking-wide'>{user?.role}</p>
                </div>

                <nav className='grid p-3 gap-1.5'>
                    {navLinks.map(link => (
                        <NavLink
                            to={link.to}
                            key={link.to}
                            className={({ isActive }) =>
                                `block px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                                isActive ? activeStyle : defaultStyle
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Overlay khi sidebar mở trên mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-10"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-grow h-full p-4 md:p-6 overflow-y-auto">
                <div className="h-12 md:hidden"></div>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;