import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

import productCategory from '../helpers/productCategory'; // Thể loại phim
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';

// Danh sách trạng thái phim (nên đưa ra file helper nếu dùng ở nhiều nơi)
const movieStatus = [
  { value: 'upcoming', label: 'Sắp chiếu' },
  { value: 'showing', label: 'Đang chiếu' },
  { value: 'early_access', label: 'Chiếu sớm' },
];

const AdminEditProduct = ({
    onClose,
    productData, // Dữ liệu phim hiện tại cần sửa
    fetchdata    // Hàm fetch lại danh sách phim sau khi sửa
}) => {

  // Khởi tạo state với dữ liệu phim hiện tại
  const [data, setData] = useState({
    _id: productData?._id, // Giữ lại _id để biết phim nào cần cập nhật
    productName: productData?.productName || "",       // Tên phim
    brandName: productData?.brandName || "",         // Quốc gia / Đạo diễn
    category: productData?.category || "",           // Thể loại
    productImage: productData?.productImage || [],   // Poster
    description: productData?.description || "",       // Mô tả
    sellingPrice: productData?.sellingPrice || "",   // Giá vé
    status: productData?.status || "upcoming",       // Trạng thái phim
    cinemaHall: productData?.cinemaHall || "Rạp 1"   // Rạp chiếu
    // price : productData?.price || "", // Bỏ giá gốc nếu không dùng
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State cho việc tải ảnh

  // Xử lý thay đổi input/select
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý tải ảnh poster mới
  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setIsUploading(true); // Bắt đầu tải
        const uploadImageCloudinary = await uploadImage(file);
        setIsUploading(false); // Kết thúc tải

        if (uploadImageCloudinary.url) {
            setData((prev) => ({
              ...prev,
              productImage: [...prev.productImage, uploadImageCloudinary.url]
            }));
            toast.success("Tải ảnh lên thành công!");
        } else {
            toast.error("Lỗi tải ảnh lên!");
            console.error("Cloudinary upload error:", uploadImageCloudinary); // Log lỗi chi tiết
        }
    }
  };

  // Xử lý xóa ảnh poster
  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: [...newProductImage]
    }));
    toast.info("Đã xóa ảnh.");
  };

  // Xử lý submit form cập nhật phim
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!data.productName || !data.brandName || !data.category || data.productImage.length === 0 || !data.sellingPrice || !data.status || !data.cinemaHall) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
    }

    // Gọi API cập nhật
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      // Gửi toàn bộ state data (đã bao gồm _id)
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message || "Chỉnh sửa phim thành công!");
      onClose(); // Đóng modal
      fetchdata(); // Fetch lại danh sách phim
    } else {
      toast.error(responseData?.message || "Chỉnh sửa phim thất bại!");
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'> {/* Tăng z-index */}
      <div className='bg-white p-4 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[95vh] overflow-hidden flex flex-col'> {/* Tăng max-w và max-h, thêm flex-col */}

        {/* Header Modal */}
        <div className='flex justify-between items-center pb-3 border-b mb-4'>
          <h2 className='font-bold text-xl'>Chỉnh sửa phim</h2> {/* Tăng font-size */}
          <button className='text-2xl hover:text-red-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors' onClick={onClose} aria-label="Đóng">
            <CgClose />
          </button>
        </div>

        {/* Form Content - Cho phép scroll */}
        <form className='flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto' onSubmit={handleSubmit}>
          {/* Cột trái */}
          <div className="space-y-3">
            <div>
              <label htmlFor='productName' className='block mb-1 font-medium'>Tên phim :</label>
              <input
                type='text'
                id='productName'
                placeholder='Nhập tên phim...'
                name='productName'
                value={data.productName}
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
                required
              />
            </div>

            <div>
              <label htmlFor='brandName' className='block mb-1 font-medium'>Quốc gia / Đạo diễn :</label>
              <input
                type='text'
                id='brandName'
                placeholder='Nhập quốc gia hoặc đạo diễn...'
                value={data.brandName}
                name='brandName'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
                required
              />
            </div>

            <div>
              <label htmlFor='category' className='block mb-1 font-medium'>Thể loại :</label>
              <select
                required
                value={data.category}
                name='category'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
              >
                <option value={""} disabled>-- Chọn thể loại --</option>
                {
                  productCategory.map((el) => {
                    // Bỏ qua option "Tất cả"
                    if (el.value !== "all") {
                        return <option value={el.value} key={el.value}>{el.label}</option>;
                    }
                    return null;
                  })
                }
              </select>
            </div>

            <div>
              <label htmlFor='status' className='block mb-1 font-medium'>Trạng thái :</label>
              <select
                required
                value={data.status}
                name='status'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
              >
                {
                  movieStatus.map((el) => (
                    <option value={el.value} key={el.value}>{el.label}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label htmlFor='cinemaHall' className='block mb-1 font-medium'>Rạp chiếu :</label>
              <input
                type='text'
                id='cinemaHall'
                placeholder='Nhập tên hoặc số rạp...'
                value={data.cinemaHall}
                name='cinemaHall'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
                required
              />
            </div>

            <div>
              <label htmlFor='sellingPrice' className='block mb-1 font-medium'>Giá vé (VNĐ) :</label>
              <input
                type='number'
                id='sellingPrice'
                placeholder='Nhập giá vé...'
                value={data.sellingPrice}
                name='sellingPrice'
                min="0"
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded w-full focus:outline-none focus:ring-2 focus:ring-red-300'
                required
              />
            </div>
             {/* Bỏ giá gốc nếu không cần */}
             {/* <div>
              <label htmlFor='price' className='block mb-1 font-medium'>Giá gốc (nếu có) :</label>
              <input ... />
             </div> */}
          </div>

          {/* Cột phải */}
          <div className="space-y-3">
            <div>
              <label htmlFor='productImage' className='block mb-1 font-medium'>Poster phim ({data.productImage.length}) :</label>
              <label htmlFor='uploadImageInput'>
                <div className='p-3 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-200 transition-colors'>
                  <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                    <span className='text-4xl'><FaCloudUploadAlt /></span>
                    <p className='text-sm'>{isUploading ? "Đang tải..." : "Tải poster mới"}</p>
                    <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} accept="image/*" disabled={isUploading} />
                  </div>
                </div>
              </label>
              {data.productImage.length === 0 && !isUploading && (
                 <p className='text-red-600 text-xs mt-1'>*Vui lòng chọn ít nhất một poster phim.</p>
              )}
            </div>

            {/* Hiển thị ảnh đã tải lên */}
            {data.productImage.length > 0 && (
              <div className='flex items-center gap-2 flex-wrap border p-2 rounded bg-gray-50 max-h-40 overflow-y-auto'>
                {data.productImage.map((el, index) => (
                  <div className='relative group flex-shrink-0' key={el + index}>
                    <img
                      src={el}
                      alt={`poster ${index + 1}`}
                      width={80}
                      height={80}
                      className='bg-slate-100 border cursor-pointer object-cover h-20 w-20 rounded' // Set kích thước cố định
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <button
                       type="button" // Ngăn submit form khi bấm xóa
                       className='absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer text-xs w-5 h-5' // Căn giữa icon
                       onClick={() => handleDeleteProductImage(index)}
                       aria-label={`Xóa ảnh ${index + 1}`}
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}

             <div>
              <label htmlFor='description' className='block mb-1 font-medium'>Mô tả phim :</label>
              <textarea
                id="description"
                className='h-36 bg-slate-100 border rounded resize-none p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-300'
                placeholder='Nhập mô tả phim...'
                onChange={handleOnChange}
                name='description'
                value={data.description}
              >
              </textarea>
             </div>
          </div>

           {/* Nút submit đặt ở cuối, span full 2 cột */}
           <div className="md:col-span-2 flex justify-end p-4 border-t mt-auto sticky bottom-0 bg-white z-10">
             <button type="submit" className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold'>
               Lưu thay đổi
             </button>
           </div>
        </form>

      </div>

      {/* Modal hiển thị ảnh full screen */}
      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}

    </div>
  );
};

export default AdminEditProduct;
