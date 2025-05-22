import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';

// --- Import component thẻ phim đơn lẻ ---
import VerticalCard from './VerticalCard'; // <<< QUAN TRỌNG: Import component đã sửa
// ---

const VerticalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(8).fill(null); // Skeleton loaders

    const scrollElement = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    // --- fetchData, updateButtonVisibility, scrollRight, scrollLeft hooks giữ nguyên ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setData(categoryProduct?.data || []);
        setLoading(false);
    }, [category]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateButtonVisibility = useCallback(() => {
        const element = scrollElement.current;
        if (element) {
            const { scrollLeft, scrollWidth, clientWidth } = element;
            setShowLeftButton(scrollLeft > 5);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
        } else {
             setShowLeftButton(false);
             setShowRightButton(false);
        }
    }, []);

     useEffect(() => {
        const element = scrollElement.current;
        if (element && !loading && data.length > 0) {
             updateButtonVisibility();
            element.addEventListener('scroll', updateButtonVisibility, { passive: true });
            window.addEventListener('resize', updateButtonVisibility);
            return () => {
                element.removeEventListener('scroll', updateButtonVisibility);
                window.removeEventListener('resize', updateButtonVisibility);
            };
        } else {
             setShowLeftButton(false);
             setShowRightButton(false);
        }
    }, [loading, data, updateButtonVisibility]);

    const scrollDistance = 236 * 2;

    const scrollRight = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
         if (scrollElement.current) {
            scrollElement.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        }
    };
    // --- Kết thúc phần hooks ---

    return (
        <div className='container mx-auto px-4 my-6'> {/* Container chính */}
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2> {/* Tiêu đề */}

            <div className="relative"> {/* Bọc nút và thanh cuộn */}
                {/* Nút cuộn trái */}
                {showLeftButton && (
                     <button
                        className='bg-white shadow-lg hover:bg-gray-100 transition-colors duration-200 rounded-full p-1.5 absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-20 text-xl hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400'
                        onClick={scrollLeft}
                        aria-label="Cuộn trái"
                        style={{ width: '36px', height: '36px' }}
                    >
                        <FaAngleLeft />
                    </button>
                )}

                {/* Container cuộn ngang */}
                <div
                    className='flex items-stretch gap-3 md:gap-4 overflow-x-auto scrollbar-none transition-all pb-2 scroll-smooth' // Layout flex, cuộn ngang, khoảng cách
                    ref={scrollElement}
                >
                    {loading ? (
                        // --- Hiển thị Skeleton Loading ---
                        loadingList.map((_, index) => (
                            <div key={"loading-v-" + index} className='w-full min-w-[200px] md:min-w-[220px] max-w-[200px] md:max-w-[220px] bg-white rounded-lg shadow-md animate-pulse overflow-hidden flex-shrink-0'>
                                {/* Giữ nguyên skeleton như trước */}
                                <div className='bg-slate-200 h-60 sm:h-72'></div>
                                <div className='p-2 grid gap-1.5'>
                                    <div className='h-5 bg-slate-200 rounded'></div>
                                    <div className='h-3 bg-slate-200 rounded w-1/2'></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // --- Hiển thị các thẻ phim thực tế ---
                        data.map((movie) => (
                            // *** Sử dụng component VerticalCard đã được chỉnh sửa ***
                            <VerticalCard
                                key={movie._id}
                                movieData={movie}
                            />
                            // *** Kết thúc sử dụng VerticalCard ***
                        ))
                    )}
                 </div>

                {/* Nút cuộn phải */}
                 {showRightButton && (
                     <button
                         className='bg-white shadow-lg hover:bg-gray-100 transition-colors duration-200 rounded-full p-1.5 absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-20 text-xl hidden md:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400'
                        onClick={scrollRight}
                        aria-label="Cuộn phải"
                        style={{ width: '36px', height: '36px' }}
                    >
                        <FaAngleRight />
                    </button>
                 )}
            </div>
        </div>
    );
};

export default VerticalCardProduct;