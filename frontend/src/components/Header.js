import React, { useState } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery.join(' ')); // Join nếu có nhiều query q

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    });
    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      setMenuDisplay(false); // Đóng menu khi logout
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const closeMenu = () => setMenuDisplay(false); // Hàm đóng menu

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"} onClick={closeMenu}> {/* Đóng menu khi click logo */}
            <Logo w={90} h={50} />
          </Link>
        </div>

        {/* Search Bar */}
        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow-md pl-3'>
          <input
            type='text'
            placeholder='Tìm kiếm phim...'
            className='w-full outline-none bg-transparent text-sm'
            onChange={handleSearch}
            value={search}
          />
          <button className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white hover:bg-red-700 focus:outline-none' aria-label="Tìm kiếm">
            <GrSearch />
          </button>
        </div>

        {/* User Actions */}
        <div className='flex items-center gap-5 md:gap-7'>
          {/* User Menu */}
          <div className='relative flex justify-center'>
            {user?._id && (
              <button
                onClick={() => setMenuDisplay(prev => !prev)}
                className='text-3xl cursor-pointer relative flex justify-center focus:outline-none'
                aria-haspopup="true"
                aria-expanded={menuDisplay}
                aria-label="Mở menu người dùng"
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-1 ring-offset-1 ring-slate-300' alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </button>
            )}
            {/* Dropdown Menu */}
            {menuDisplay && user?._id && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5'>
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Chào, <span className='font-medium'>{user.name}</span>
                </div>
                <nav className='flex flex-col'>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                        to={"/admin-panel/all-products"}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md' // Style link
                        onClick={closeMenu} // Đóng menu khi click
                    >
                        Trang quản trị
                    </Link>
                  )}
                  <Link
                        to={"/my-bookings"} // Link đến trang lịch sử đặt vé
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Style link
                        onClick={closeMenu} // Đóng menu khi click
                    >
                        Vé của tôi
                    </Link>
                  {/* Thêm các link khác nếu cần */}
                </nav>
              </div>
            )}
          </div>

          {/* Login/Logout Button */}
          <div>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors'>Đăng xuất</button>
            ) : (
              <Link to={"/login"} className='px-3 py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors'>Đăng nhập</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;