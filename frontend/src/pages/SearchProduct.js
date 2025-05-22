// TÌM KIẾM PHIM
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard'; // Component để hiển thị thẻ phim
import { toast } from 'react-toastify';

const SearchProduct = () => {
    const location = useLocation(); // Hook để lấy thông tin URL hiện tại
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const query = new URLSearchParams(location.search).get("q"); // Lấy giá trị của tham số 'q' từ URL

    // Hàm gọi API tìm kiếm
    const fetchSearchProduct = useCallback(async () => {
        if (!query) {
            setData([]); // Nếu không có query thì không tìm gì cả
            return;
        }
        setLoading(true);
        try {
            // Gọi API tìm kiếm, truyền query vào URL
            const response = await fetch(`${SummaryApi.searchProduct.url}?q=${encodeURIComponent(query)}`, {
                method: SummaryApi.searchProduct.method
            });
            const dataResponse = await response.json();

            setLoading(false);
            if (dataResponse.success) {
                setData(dataResponse.data || []);
            } else {
                setData([]);
                toast.error(dataResponse.message || "Lỗi khi tìm kiếm phim.");
            }
        } catch (error) {
            setLoading(false);
            setData([]);
            toast.error("Lỗi kết nối khi tìm kiếm phim.");
            console.error("Search Error:", error);
        }
    }, [query]); // Dependency là query, fetch lại khi query thay đổi

    // useEffect để gọi fetchSearchProduct khi component mount hoặc query thay đổi
    useEffect(() => {
        fetchSearchProduct();
    }, [fetchSearchProduct]);

    return (
        <div className='container mx-auto p-4 min-h-[calc(100vh-120px)]'>
            {loading && (
                <p className='text-lg text-center my-10'>Đang tìm kiếm...</p>
            )}

            {!loading && (
                <>
                    <p className='text-lg font-semibold my-3'>Kết quả tìm kiếm cho: <span className='text-red-600'>"{query}"</span></p>

                    {data.length === 0 && query && (
                         <div className='text-center text-lg bg-white py-10 rounded shadow text-gray-500'>
                             Không tìm thấy phim nào phù hợp.
                         </div>
                    )}
                    {!query && (
                         <div className='text-center text-lg bg-white py-10 rounded shadow text-gray-500'>
                             Nhập từ khóa vào ô tìm kiếm phía trên để tìm phim.
                         </div>
                    )}

                    {data.length > 0 && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                            {data.map((product) => (
                                // Sử dụng VerticalCard để hiển thị từng kết quả
                                <VerticalCard key={product._id} movieData={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchProduct;