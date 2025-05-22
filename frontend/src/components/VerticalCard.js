// PHIM Ở TRANG CHỦ
import React from 'react';
import { Link } from 'react-router-dom';
import scrollTop from '../helpers/scrollTop';
import productCategory from '../helpers/productCategory';
import displayINRCurrency from '../helpers/displayCurrency'; // Import giá tiền

const VerticalCard = ({ movieData }) => {

    const getCategoryLabel = (value) => {
        const category = productCategory.find(cat => cat.value === value);
        return category ? category.label : value;
    };

    if (!movieData) {
        return null;
    }

    return (
        <Link
            to={"/product/" + movieData?._id}
            // Thêm group, tăng shadow khi hover, transition mượt hơn
            className='group w-full min-w-[200px] md:min-w-[220px] max-w-[200px] md:max-w-[220px] bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 overflow-hidden border border-transparent hover:border-red-100'
            onClick={scrollTop}
        >
            <div className='relative bg-gray-100 h-60 sm:h-72 flex justify-center items-center overflow-hidden rounded-t-lg'> {/* Thêm nền xám nhạt, bo góc trên */}
                <img
                    src={movieData?.productImage?.[0]}
                    alt={movieData?.productName}
                    // Hiệu ứng zoom mượt hơn
                    className='object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 ease-in-out'
                    loading="lazy"
                />
                 {/* Nhãn trạng thái */}
                 {movieData.status === 'early_access' && (
                     <span className='absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded z-10 bg-red-600 text-white shadow-sm'>
                         CHIẾU SỚM
                     </span>
                 )}
                 {movieData.status === 'showing' && (
                     <span className='absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded z-10 bg-green-600 text-white shadow-sm'>
                         ĐANG CHIẾU
                     </span>
                 )}
                 {movieData.status === 'upcoming' && (
                     <span className='absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded z-10 bg-yellow-500 text-white shadow-sm'>
                         SẮP CHIẾU
                     </span>
                 )}


                 {/* Lớp phủ "Mua vé" - Xuất hiện mượt hơn */}
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <span className="text-white text-lg font-semibold border-2 border-white rounded-full px-5 py-1.5 transform group-hover:scale-100 scale-90 transition-transform duration-300">
                        Xem chi tiết
                     </span>
                 </div>
            </div>

            <div className='p-3 flex flex-col flex-grow'> {/* Tăng padding nhẹ */}
                <h2 className='font-semibold text-base text-gray-800 mb-1 h-12 line-clamp-2 group-hover:text-red-600 transition-colors'> {/* Đổi màu khi hover card */}
                    {movieData?.productName}
                </h2>
                <p className='capitalize text-gray-500 text-sm mb-2'> {/* Tăng margin bottom */}
                    {getCategoryLabel(movieData?.category)}
                </p>
                {/* Thêm giá vé */}
                <div className="mt-auto pt-2 border-t border-gray-100"> {/* Đẩy giá xuống dưới cùng, thêm border top */}
                    <p className='text-red-600 font-bold text-lg'>
                        {displayINRCurrency(movieData?.sellingPrice)}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default VerticalCard;
// --- END OF FILE components/VerticalCard.js ---