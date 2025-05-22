import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import { CgSpinner } from 'react-icons/cg';
import { FaFilter, FaTimes } from 'react-icons/fa'; // Thêm icon đóng

const CategoryProduct = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListingArray = urlSearch.getAll("category");

    // --- Logic state cho filter (giữ nguyên và cải thiện) ---
    const initialSelectCategory = {};
    if (urlCategoryListingArray.length > 0 && !urlCategoryListingArray.includes("all")) {
        urlCategoryListingArray.forEach(el => { initialSelectCategory[el] = true; });
    } else {
        initialSelectCategory["all"] = true;
    }

    const [selectCategory, setSelectCategory] = useState(initialSelectCategory);
    // filterCategoryList sẽ được tính toán lại trong useEffect dựa trên selectCategory
    // không cần state riêng cho nó nữa để tránh bất đồng bộ.

    // State cho modal filter trên mobile
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const fetchData = useCallback(async (categoriesToFetch) => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.filterProduct.url, {
                method: SummaryApi.filterProduct.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    category: categoriesToFetch.includes("all") ? [] : categoriesToFetch
                })
            });
            const dataResponse = await response.json();
            setData(dataResponse?.data || []);
        } catch (error) {
            console.error("Error fetching category products:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []); // Không cần dependency ở đây vì categoriesToFetch sẽ được truyền vào

    const handleSelectCategory = (e) => {
        const { value, checked } = e.target;
        setSelectCategory((prev) => {
            let newSelection;
            if (value === 'all') {
                newSelection = { all: true };
            } else {
                newSelection = { ...prev, [value]: checked, all: false };
                const otherChecked = Object.keys(newSelection).some(key => key !== 'all' && newSelection[key]);
                if (!otherChecked) {
                    newSelection.all = true;
                }
            }
            return newSelection;
        });
    };

    // useEffect để fetch data và cập nhật URL khi selectCategory thay đổi
    useEffect(() => {
        const activeCategories = Object.keys(selectCategory).filter(key => selectCategory[key]);
        const effectiveCategories = activeCategories.includes("all") || activeCategories.length === 0
            ? ["all"]
            : activeCategories.filter(cat => cat !== 'all');

        fetchData(effectiveCategories); // Gọi fetchData với danh sách category đã được tính toán

        const urlFormat = effectiveCategories.includes("all")
            ? ""
            : effectiveCategories.map(el => `category=${el}`).join("&");
        const newSearch = urlFormat ? `?${urlFormat}` : "";

        if (location.search !== newSearch) {
            navigate(`/product-category${newSearch}`, { replace: true });
        }
    }, [selectCategory, navigate, location.search, fetchData]);


    const getCategoryLabel = (value) => {
        const category = productCategory.find(cat => cat.value === value);
        return category ? category.label : value;
    };

    const currentSelectedCategoriesForTitle = Object.keys(selectCategory)
        .filter(key => selectCategory[key] && key !== 'all');

    const pageTitle = currentSelectedCategoriesForTitle.length > 0
        ? `Phim thể loại: ${currentSelectedCategoriesForTitle.map(getCategoryLabel).join(', ')}`
        : "Tất cả phim";

    // Component Checkbox dùng chung cho Desktop và Mobile Filter
    const CategoryCheckbox = ({ categoryName, idSuffix }) => (
        <div className='flex items-center gap-3 hover:bg-slate-100 px-2.5 py-2 rounded-md cursor-pointer transition-colors'>
            <input
                type='checkbox'
                name={"category"}
                checked={selectCategory[categoryName.value] || false}
                value={categoryName.value}
                id={`${categoryName.value}-${idSuffix}`}
                onChange={handleSelectCategory}
                className='cursor-pointer w-4 h-4 accent-red-600 focus:ring-red-500 focus:ring-offset-1'
            />
            <label htmlFor={`${categoryName.value}-${idSuffix}`} className={`cursor-pointer flex-grow ${categoryName.value === 'all' ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>
                {categoryName.label}
            </label>
        </div>
    );

    return (
        <div className='container mx-auto p-4 min-h-[calc(100vh-120px)]'>
            {/* --- Header Mobile (Tiêu đề và Nút Lọc) --- */}
            <div className="lg:hidden mb-4 flex justify-between items-center sticky top-16 bg-slate-100 -mx-4 px-4 py-3 z-20 shadow-sm"> {/* Sticky header mobile */}
                 <h2 className='text-lg sm:text-xl font-semibold text-gray-800 truncate pr-2'>{pageTitle} ({data.length})</h2>
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="p-2.5 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <FaFilter size={14}/> Lọc
                </button>
            </div>

            {/* --- Desktop Version --- */}
            <div className='hidden lg:grid grid-cols-[280px,1fr] gap-x-8 gap-y-6'>
                <aside className='bg-white p-5 rounded-lg shadow-lg sticky top-20 h-fit'> {/* Sidebar filter dính */}
                    <h3 className='text-lg uppercase font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4'>Thể loại</h3>
                    <form className='text-sm flex flex-col gap-0.5'>
                        {productCategory.map((cat) => (
                            <CategoryCheckbox categoryName={cat} idSuffix="desktop" key={`desktop-${cat.value}`} />
                        ))}
                    </form>
                </aside>

                <main>
                    <h2 className='hidden lg:block font-semibold text-gray-800 text-2xl mb-5'>{pageTitle} ({data.length} phim)</h2>
                    {loading && <div className="flex justify-center items-center min-h-[300px] py-10"><CgSpinner size={36} className="animate-spin text-red-600"/></div>}
                    {!loading && data.length === 0 && (
                        <div className='text-center text-lg bg-white py-12 rounded-lg shadow text-gray-500'>
                            Không có phim nào thuộc thể loại này.
                        </div>
                    )}
                    {!loading && data.length > 0 && (
                         <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5'> {/* Điều chỉnh số cột cho desktop */}
                            {data.map((movie) => ( <VerticalCard key={movie._id} movieData={movie} /> ))}
                        </div>
                    )}
                </main>
            </div>

            {/* --- Mobile Version (Grid) --- */}
            <div className='lg:hidden'>
                {/* Tiêu đề đã được hiển thị cùng nút filter ở trên */}
                {loading && <div className="flex justify-center items-center min-h-[300px] py-10"><CgSpinner size={36} className="animate-spin text-red-600"/></div>}
                {!loading && data.length === 0 && (
                    <div className='text-center text-lg bg-white py-12 rounded-lg shadow text-gray-500 mt-4'> {/* Thêm mt-4 */}
                        Không có phim nào thuộc thể loại này.
                    </div>
                 )}
                 {!loading && data.length > 0 && (
                    // Yêu cầu: 2 phim trên một hàng, gap nhỏ hơn
                    <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                        {data.map((movie) => ( <VerticalCard key={movie._id} movieData={movie} /> ))}
                    </div>
                )}
            </div>

            {/* --- Mobile Filter Modal --- */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-end sm:items-center justify-center transition-opacity duration-300 ease-in-out" onClick={() => setMobileFilterOpen(false)}>
                    <div
                        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[70vh] sm:max-h-[80vh] overflow-hidden flex flex-col transform transition-transform duration-300 ease-in-out sm:translate-y-0 translate-y-full"
                        style={mobileFilterOpen ? {transform: 'translateY(0)'} : {}} // Animation trượt lên
                        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h3 className='text-lg font-semibold text-gray-800'>Chọn thể loại</h3>
                            <button onClick={() => setMobileFilterOpen(false)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                                <FaTimes size={20}/>
                            </button>
                        </div>
                        <form className='text-sm flex flex-col gap-0.5 p-4 overflow-y-auto flex-grow'>
                            {productCategory.map((cat) => (
                                <CategoryCheckbox categoryName={cat} idSuffix="mobile" key={`mobile-${cat.value}`} />
                            ))}
                        </form>
                        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                            <button
                                onClick={() => setMobileFilterOpen(false)} // Chỉ cần đóng modal
                                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-base"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProduct;