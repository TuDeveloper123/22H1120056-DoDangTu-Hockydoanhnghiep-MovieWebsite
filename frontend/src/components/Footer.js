import React from 'react';
import { Link } from 'react-router-dom'; // Import Link nếu cần
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa"; // Ví dụ icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-slate-800 text-slate-300 mt-10'> {/* Đổi màu nền và chữ */}
      <div className='container mx-auto p-6 md:p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          {/* Cột 1: Giới thiệu/Logo */}
          <div>
            {/* <Logo w={100} h={50} /> */} {/* Có thể thêm logo nếu muốn */}
            <h3 className='text-lg font-semibold text-white mb-3'>Cinemas</h3>
            <p className='text-sm leading-relaxed'>
              Trải nghiệm điện ảnh đỉnh cao với những bộ phim bom tấn và dịch vụ tốt nhất.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className='text-md font-semibold text-white mb-3'>Liên kết</h4>
            <ul className='space-y-2 text-sm'>
              <li><Link to="/product-category" className='hover:text-red-400 transition-colors'>Phim Đang Chiếu</Link></li>
              <li><Link to="/product-category?category=upcoming" className='hover:text-red-400 transition-colors'>Phim Sắp Chiếu</Link></li>
              <li><Link to="#" className='hover:text-red-400 transition-colors'>Lịch chiếu</Link></li> {/* Thay # bằng link thực tế */}
              <li><Link to="#" className='hover:text-red-400 transition-colors'>Khuyến mãi</Link></li>
              <li><Link to="#" className='hover:text-red-400 transition-colors'>Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Mạng xã hội */}
          <div>
            <h4 className='text-md font-semibold text-white mb-3'>Kết nối với chúng tôi</h4>
            <div className='flex space-x-4'>
              <a href="#" target="_blank" rel="noopener noreferrer" className='text-slate-300 hover:text-white transition-colors' aria-label="Facebook">
                <FaFacebookF size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className='text-slate-300 hover:text-white transition-colors' aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className='text-slate-300 hover:text-white transition-colors' aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
             <h4 className='text-md font-semibold text-white mt-6 mb-3'>Tải ứng dụng</h4>
             {/* Thêm link/hình ảnh tải app */}
             <p className='text-sm'>Sắp có trên App Store và Google Play.</p>
          </div>
        </div>

        {/* Đường kẻ ngang */}
        <div className='border-t border-slate-700 pt-6 text-center text-sm'>
          <p>© {currentYear} Cinemas. Bảo lưu mọi quyền.</p>
          {/* <p>
            <Link to="/terms" className='hover:underline mx-2'>Điều khoản dịch vụ</Link> |
            <Link to="/privacy" className='hover:underline mx-2'>Chính sách bảo mật</Link>
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;