// --- START OF FILE components/AdminProductCard.js ---
import React, { useState } from 'react';
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct, setEditProduct] = useState(false);

    const handleSoftDelete = async (productId, productName) => {
        if (window.confirm(`Bạn có chắc muốn xóa phim "${productName}" không? Phim sẽ được chuyển vào thùng rác.`)) {
            try {
                const response = await fetch(`${SummaryApi.softDeleteProduct.url}/${productId}`, {
                    method: SummaryApi.softDeleteProduct.method,
                    credentials: 'include',
                });
                const dataResponse = await response.json();
                if (dataResponse.success) {
                    toast.success(dataResponse.message || "Đã chuyển phim vào thùng rác.");
                    fetchdata();
                } else {
                    toast.error(dataResponse.message || "Xóa phim thất bại.");
                }
            } catch (error) {
                toast.error("Lỗi kết nối khi xóa phim.");
                console.error("Soft delete error:", error);
            }
        }
    };

    // Helper function for status badge style
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'showing': return 'bg-green-100 text-green-800 border border-green-200';
            case 'early_access': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'upcoming': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'showing': return 'Đang chiếu';
            case 'early_access': return 'Chiếu sớm';
            case 'upcoming': return 'Sắp chiếu';
            default: return status;
        }
    };


    return (
        // Thêm group, border nhẹ, shadow đẹp hơn
        <div className='group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full max-w-[240px] flex flex-col border border-gray-100'>
            <div className='w-full flex-shrink-0'>
                <div className='w-full h-48 flex justify-center items-center mb-3 overflow-hidden rounded-md bg-gray-100'> {/* Tăng chiều cao ảnh, bo góc */}
                    <img src={data?.productImage[0]} alt={data?.productName} className='mx-auto object-contain h-full w-auto group-hover:scale-105 transition-transform duration-300'/> {/* object-contain để thấy hết ảnh */}
                </div>
                <h1 className='text-ellipsis line-clamp-2 font-semibold text-gray-800 text-base h-12 mb-2'>{data.productName}</h1>
                 {/* Badge trạng thái */}
                 <p className={`text-xs capitalize font-medium mb-3 px-2 py-0.5 rounded-full inline-block ${getStatusBadgeStyle(data.status)}`}>
                    {getStatusLabel(data.status)}
                 </p>
            </div>

            {/* Phần giá và nút đẩy xuống dưới */}
            <div className='mt-auto pt-2 border-t border-gray-100'>
                <div className='flex justify-between items-center'>
                    <p className='font-bold text-red-600 text-lg'>
                        {displayINRCurrency(data.sellingPrice)}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className='p-2 bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white rounded-full cursor-pointer transition-colors duration-200'
                            onClick={() => setEditProduct(true)}
                            title="Chỉnh sửa"
                        >
                            <MdModeEditOutline size={18}/>
                        </button>
                        <button
                            className='p-2 bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white rounded-full cursor-pointer transition-colors duration-200'
                            onClick={() => handleSoftDelete(data._id, data.productName)}
                            title="Xóa (Thùng rác)"
                        >
                            <MdDeleteForever size={18}/>
                        </button>
                    </div>
                </div>
            </div>


            {
                editProduct && (
                    <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchdata={fetchdata} />
                )
            }
        </div>
    );
}

export default AdminProductCard;
// --- END OF FILE components/AdminProductCard.js ---