import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

// Helper function để lấy label từ value
import productCategoryHelper from '../helpers/productCategory';
const getCategoryLabel = (value) => {
    const category = productCategoryHelper.find(cat => cat.value === value);
    return category ? category.label : value;
};


const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    // Tăng số lượng skeleton loader nếu cần
    const categoryLoading = new Array(8).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();
            if (dataResponse.success) {
                 // Lọc bỏ các category không mong muốn nếu cần (ví dụ: 'all')
                setCategoryProduct(dataResponse.data.filter(p => p.category && p.category !== 'all'));
            } else {
                 console.error("Error fetching categories:", dataResponse.message);
            }
        } catch (error) {
            console.error("Network error fetching categories:", error);
        } finally {
             setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl font-semibold mb-4'>Thể loại phim</h2>
            {/* Sử dụng grid để hiển thị, cho phép xuống dòng */}
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-center items-center'>
                {loading ? (
                    categoryLoading.map((_, index) => (
                        <div className='h-28 w-full bg-slate-200 animate-pulse rounded-lg' key={"categoryLoading" + index}>
                            <div className='h-20 bg-slate-300 rounded-t-lg'></div>
                            <div className='h-4 mt-2 mx-2 bg-slate-300 rounded'></div>
                        </div>
                    ))
                ) : (
                    categoryProduct.map((product) => (
                        <Link
                            to={"/product-category?category=" + product?.category}
                            className='block cursor-pointer text-center group' // Thêm group cho hover effect
                            key={product?.category}
                        >
                            {/* Card chữ nhật */}
                            <div className='bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out aspect-square flex flex-col items-center justify-center border border-transparent group-hover:border-red-200'> {/* aspect-square để giữ tỉ lệ vuông */}
                                <div className='w-16 h-16 mb-2 flex items-center justify-center'> {/* Container ảnh */}
                                    <img
                                        src={product?.productImage[0]}
                                        alt={getCategoryLabel(product?.category)} // Hiển thị label
                                        className='max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200 ease-in-out'
                                    />
                                </div>
                                {/* Lấy label thay vì value */}
                                <p className='text-sm font-medium capitalize group-hover:text-red-600 transition-colors'>
                                    {getCategoryLabel(product?.category)}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
                {/* Optional: Link "Xem tất cả" */}
                {!loading && (
                    <Link
                        to={"/product-category"} // Link đến trang category không có filter
                        className='block cursor-pointer text-center group'
                    >
                         <div className='bg-slate-100 p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 ease-in-out aspect-square flex flex-col items-center justify-center border border-slate-200 group-hover:border-red-200'>
                             <span className='text-3xl text-slate-500 mb-2'>+</span>
                            <p className='text-sm font-medium capitalize group-hover:text-red-600 transition-colors'>
                                Xem tất cả
                            </p>
                         </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default CategoryList;