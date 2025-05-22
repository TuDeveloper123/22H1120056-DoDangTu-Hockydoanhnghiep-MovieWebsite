// TẤT CẢ PHIM - ADMIN
import React, { useEffect, useState, useMemo } from 'react'; // Thêm useMemo
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import productCategory from '../helpers/productCategory'; // Import thể loại
import { GrSearch } from "react-icons/gr"; // Import icon search

// Danh sách trạng thái phim (có thể đưa ra helper)
const movieStatus = [
  { value: 'all', label: 'Tất cả trạng thái' }, // Thêm option All
  { value: 'upcoming', label: 'Sắp chiếu' },
  { value: 'showing', label: 'Đang chiếu' },
  { value: 'early_access', label: 'Chiếu sớm' },
];

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]); // Danh sách gốc
  const [loading, setLoading] = useState(true);

  // --- State mới cho bộ lọc và tìm kiếm ---
  const [selectedStatus, setSelectedStatus] = useState('all'); // Mặc định là tất cả
  const [selectedCategory, setSelectedCategory] = useState('all'); // Mặc định là tất cả
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm

  // --- Hàm fetch dữ liệu gốc ---
  const fetchAllProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.allProduct.url); // API vẫn lấy tất cả phim active
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setAllProduct(dataResponse?.data || []);
      } else {
        console.error("Error fetching movies:", dataResponse.message);
        setAllProduct([]); // Đảm bảo là mảng rỗng nếu lỗi
      }
    } catch (error) {
      console.error("Network error fetching movies:", error);
      setAllProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  // --- Logic Lọc và Tìm kiếm (Client-side) ---
  // Sử dụng useMemo để tối ưu, chỉ tính toán lại khi dependency thay đổi
  const filteredProduct = useMemo(() => {
    let filtered = [...allProduct]; // Bắt đầu với danh sách gốc

    // 1. Lọc theo trạng thái
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    // 2. Lọc theo thể loại
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 3. Lọc theo từ khóa tìm kiếm (tìm trong tên phim - không phân biệt hoa thường)
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [allProduct, selectedStatus, selectedCategory, searchTerm]); // Dependency

  // --- Hàm xử lý thay đổi bộ lọc/tìm kiếm ---
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div>
      {/* === Phần Header với Bộ lọc và Tìm kiếm === */}
      <div className='bg-white py-3 px-4 rounded-t shadow-md flex flex-wrap gap-4 justify-between items-center'>
        <h2 className='font-bold text-lg flex-shrink-0'>Quản lý phim ({filteredProduct.length})</h2>

        <div className="flex flex-wrap gap-3 items-center flex-grow">
          {/* Dropdown Trạng thái */}
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className='p-2 bg-gray-100 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 min-w-[160px]'
          >
            {movieStatus.map((status) => (
              <option value={status.value} key={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Dropdown Thể loại */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className='p-2 bg-gray-100 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 min-w-[160px]'
          >
            <option value="all">Tất cả thể loại</option>
            {productCategory.map((category) => {
              // Bỏ qua option "Tất cả" mặc định của helper nếu có
              if (category.value !== "all") {
                return <option value={category.value} key={category.value}>{category.label}</option>;
              }
              return null;
            })}
          </select>

           {/* Ô tìm kiếm */}
           <div className="relative flex-grow max-w-xs">
                <input
                    type="text"
                    placeholder="Tìm theo tên phim..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='w-full p-2 pl-8 border rounded text-sm bg-gray-100 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400'
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <GrSearch />
                </div>
            </div>
        </div>

        {/* Nút Thêm phim mới */}
        <button
          className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1.5 px-5 rounded-full font-medium flex-shrink-0'
          onClick={() => setOpenUploadProduct(true)}
        >
          Thêm phim mới
        </button>
      </div>

      {/* === Danh sách phim (đã lọc) === */}
      {loading ? (
        <p className='text-center p-6 text-gray-500'>Đang tải danh sách phim...</p>
      ) : (
        <div className='flex items-start flex-wrap gap-5 p-4 h-[calc(100vh-220px)] overflow-y-scroll bg-gray-50 rounded-b shadow-inner'> {/* Tăng chiều cao bù cho header */}
          {filteredProduct.length === 0 ? (
            <p className='text-center w-full text-gray-500 mt-10'>Không có phim nào phù hợp với bộ lọc.</p>
          ) : (
            filteredProduct.map((product, index) => (
              <AdminProductCard data={product} key={product._id || index} fetchdata={fetchAllProduct} />
            ))
          )}
        </div>
      )}

      {/* upload product component */}
      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
        )
      }
    </div>
  );
};

export default AllProducts;
// --- END OF FILE pages/AllProducts.js ---