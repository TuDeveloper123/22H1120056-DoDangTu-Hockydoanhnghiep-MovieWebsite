import React, { useEffect, useState, useCallback } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import VerticalCard from './VerticalCard'; // Component thẻ phim đơn lẻ
import { CgSpinner } from 'react-icons/cg'; // Icon loading

const CategoryWiseProductDisplay = ({ category, heading, currentMovieId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Số lượng skeleton, có thể điều chỉnh tùy theo số cột bạn muốn hiển thị mặc định
    const loadingList = new Array(4).fill(null); // Ví dụ: 4 skeleton

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchCategoryWiseProduct(category);
            // Lọc bỏ phim hiện tại đang xem ra khỏi danh sách liên quan
            const relatedMovies = (categoryProduct?.data || []).filter(movie => movie._id !== currentMovieId);
            setData(relatedMovies);
        } catch (error) {
            console.error(`Error fetching related movies for category ${category}:`, error);
            setData([]); // Đảm bảo data là mảng rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    }, [category, currentMovieId]);

    useEffect(() => {
        if (category) {
            fetchData();
        } else {
            // Nếu không có category, reset state
            setLoading(false);
            setData([]);
        }
    }, [fetchData, category]); // Thêm category vào dependency của useEffect này

    // Không hiển thị component nếu không có category, hoặc không loading và không có data
    if (!category || (!loading && data.length === 0)) {
        return null;
    }

    return (
        // Container chính cho section "Phim cùng thể loại"
        // Có thể bỏ class container nếu đã có ở ProductDetails.js
        // <div className='container mx-auto px-4 my-8 md:my-10'>
        <div> {/* Bỏ container nếu ProductDetails đã có, chỉ giữ padding/margin nếu cần */}
            <h2 className='text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-5'>{heading}</h2>

            {loading ? (
                // Skeleton loading với layout grid
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                    {loadingList.map((_, index) => (
                         <div key={"loading-related-" + index} className='w-full bg-white rounded-lg shadow-md animate-pulse'>
                            <div className='bg-slate-200 h-48 sm:h-56 md:h-64 lg:h-72 rounded-t-lg'></div>
                            <div className='p-3 grid gap-2'>
                                <div className='h-5 bg-slate-200 rounded-full'></div>
                                <p className='h-4 bg-slate-200 rounded-full w-3/4'></p>
                                <div className='flex gap-2 mt-1'> <p className='h-5 bg-slate-200 w-1/2 rounded-full'></p> </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // === GRID LAYOUT CHO CÁC THẺ PHIM ===
                // Mobile: 2 cột, gap-3 (12px)
                // sm (640px+): 3 cột, gap-4 (16px)
                // md (768px+): 4 cột, gap-4 (16px)
                // lg (1024px+) & xl (1280px+): Có thể là 4 hoặc 5 cột tùy ý, gap-5 (20px)
                // 2xl (1536px+): Có thể là 5 hoặc 6 cột
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 ${
                    data.length === 1 && !loading ? 'justify-items-center md:justify-items-start' : '' // Căn giữa thẻ duy nhất trên mobile
                }`}>
                    {data.map((movie) => (
                        <VerticalCard key={movie._id} movieData={movie} />
                    ))}
                </div>
            )}
        </div>
        // </div>
    );
};

export default CategoryWiseProductDisplay;