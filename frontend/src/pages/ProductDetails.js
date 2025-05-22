// CHI TIẾT PHIM
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf, FaShoppingCart } from "react-icons/fa"; // Thêm icon nếu muốn
import displayINRCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import CommentSection from '../components/CommentSection';
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg'; // Icon loading

// Helper function lấy label trạng thái phim
const getStatusLabel = (status) => {
    switch (status) {
        case 'showing': return 'Đang chiếu';
        case 'early_access': return 'Chiếu sớm';
        case 'upcoming': return 'Sắp chiếu';
        default: return status;
    }
};

// Helper function lấy label thể loại (có thể để ở file riêng)
const getCategoryLabel = (value) => {
    const categoryMap = {
        'action': 'Hành động', 'horror': 'Kinh dị', 'family': 'Gia đình',
        'comedy': 'Hài', 'drama': 'Tâm lý', 'romance': 'Tình cảm',
        // Thêm các thể loại khác nếu bạn có
    };
    return categoryMap[value] || value;
};


const ProductDetails = () => {
    const [data, setData] = useState({
        productName: "", brandName: "", category: "", productImage: [],
        description: "", sellingPrice: "", status: "upcoming", cinemaHall: ""
    });
    const params = useParams();
    const [loading, setLoading] = useState(true);
    // const productImageListLoading = new Array(4).fill(null); 
    const [activeImage, setActiveImage] = useState("");
    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
    const [zoomImage, setZoomImage] = useState(false);
    const navigate = useNavigate();

    // *** THÊM STATE MỚI ĐỂ LƯU SỐ LƯỢNG COMMENT ***
    const [commentCount, setCommentCount] = useState(0);

    // --- Fetch Product Details ---
    const fetchProductDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.productDetails.url, {
                method: SummaryApi.productDetails.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ productId: params?.id })
            });
            const dataResponse = await response.json();
            if (dataResponse.success && dataResponse.data) {
                setData(dataResponse.data);
                setActiveImage(dataResponse.data.productImage?.[0] || "");
            } else {
                toast.error(dataResponse.message || "Không thể tải chi tiết phim.");
                // Có thể redirect về trang chủ nếu phim không tồn tại
                // navigate('/');
            }
        } catch (error) {
            toast.error("Lỗi kết nối khi tải chi tiết phim.");
            console.error("Fetch Details Error:", error);
        } finally {
            setLoading(false);
        }
    }, [params?.id]); // Bỏ navigate nếu không dùng trong này

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]); // Chỉ fetch lại khi ID thay đổi

    // --- Image Handlers ---
    const handleMouseEnterProduct = (imageURL) => { setActiveImage(imageURL); };
    const handleZoomImage = useCallback((e) => {
        setZoomImage(true);
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setZoomImageCoordinate({ x, y });
      }, []);
    const handleLeaveImageZoom = () => { setZoomImage(false); };

    // --- Booking Handler ---
    const handleBuyTicket = (e, id) => {
        e.preventDefault();
        if (!data) return; // Đảm bảo data đã load

        if (data.status === 'showing' || data.status === 'early_access') {
            navigate(`/booking/${id}`);
        } else if (data.status === 'upcoming') {
            toast.info("Phim này sắp chiếu, chưa mở bán vé.");
        } else {
            toast.error("Không thể mua vé cho phim này.");
        }
    };
     // *** HÀM CALLBACK ĐỂ NHẬN SỐ LƯỢNG COMMENT TỪ CommentSection ***
     const handleCommentCountChange = useCallback((count) => {
      console.log("Received comment count:", count); // Debug
      setCommentCount(count);
  }, []); // Không có dependency, chỉ cần tạo 1 lần

    // --- Render Loading State ---
    if (loading) {
        return (
            <div className='container mx-auto p-4 md:p-6 min-h-[calc(100vh-120px)] flex items-center justify-center'>
                <CgSpinner size={40} className="animate-spin text-red-600" />
            </div>
        );
    }

    // --- Render Main Content ---
    return (
        <div className='container mx-auto p-4 md:p-6'>
            {/* === Phần Ảnh và Chi tiết Chính === */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10'>
                {/* --- Cột Ảnh --- */}
                <div className='flex flex-col-reverse md:flex-row gap-4 items-start'>
                    {/* Thumbnails */}
                    <div className='w-full md:w-24 flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible scrollbar-none md:max-h-[500px] flex-shrink-0'>
                        {data?.productImage?.map((imgURL, index) => (
                            <div
                                className={`bg-white p-1 rounded-md border-2 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${activeImage === imgURL ? 'border-red-500' : 'border-gray-200'}`}
                                key={imgURL + index}
                                onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                                onClick={() => handleMouseEnterProduct(imgURL)} // Click để chọn ảnh trên mobile
                            >
                                <img src={imgURL} alt={`thumbnail ${index+1}`} className='w-20 h-20 md:w-full md:h-auto object-contain' loading="lazy" />
                            </div>
                        ))}
                         {/* Skeleton Thumbnails (nếu muốn giữ) */}
                         {/* {!data?.productImage && productImageListLoading.map(...)} */}
                    </div>
                    {/* Ảnh chính */}
                    <div className='w-full h-[400px] md:h-[500px] bg-gray-100 relative p-2 overflow-hidden rounded-lg shadow-md flex-grow'>
                        <img
                            src={activeImage}
                            alt={data?.productName}
                            className='h-full w-full object-contain transition-all duration-300 ease-in-out rounded-md'
                            onMouseMove={handleZoomImage}
                            onMouseLeave={handleLeaveImageZoom}
                        />
                        {/* Zoom Image (Giữ nguyên logic) */}
                        {zoomImage && activeImage && (
                            <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-100 p-1 -right-[510px] top-0 border border-slate-300 shadow-lg z-10 rounded-md'>
                                <div
                                    className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150 origin-top-left rounded'
                                    style={{
                                        backgroundImage: `url(${activeImage})`, backgroundRepeat: 'no-repeat',
                                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                                        backgroundSize: 'contain' // Hoặc auto/cover tùy ý
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Cột Chi tiết Phim --- */}
                <div className='flex flex-col gap-3'>
                    {/* Thể loại */}
                    <span className='bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block w-fit capitalize font-semibold text-sm tracking-wide'>
                        {getCategoryLabel(data.category)}
                    </span>
                    {/* Tên phim */}
                    <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 leading-tight'>
                        {data.productName}
                    </h1>
                    {/* Thông tin khác */}
                    <div className="space-y-1.5 text-base text-gray-600 mt-1">
                        <p>Quốc gia / Đạo diễn: <span className='font-medium text-gray-800'>{data.brandName}</span></p>
                        <p>Rạp: <span className='font-medium text-gray-800'>{data.cinemaHall}</span></p>
                        <p>Trạng thái: <span className='font-medium text-gray-800'>{getStatusLabel(data.status)}</span></p>
                    </div>
                    {/* Đánh giá (ví dụ) */}
                    <div className='flex items-center gap-1.5 my-2'>
                        <div className="flex text-yellow-400">
                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalf />
                        </div>
                        <span className='text-gray-500 text-sm ml-1 font-medium'>(4.5/5 - {commentCount} đánh giá)</span> {/* Thay bằng số đánh giá thực tế nếu có */}
                    </div>
                    {/* Giá vé */}
                    <div className='flex items-center gap-3 my-3'>
                        <p className='text-red-600 text-3xl lg:text-4xl font-bold'>{displayINRCurrency(data.sellingPrice)}</p>
                        {/* Giá gốc (nếu có) */}
                        {/* {data.price && <p className='text-slate-400 line-through text-xl'>{displayINRCurrency(data.price)}</p>} */}
                    </div>
                    {/* Nút Mua vé */}
                    <div className='flex items-center gap-3 my-4'>
                        {(data.status === 'showing' || data.status === 'early_access') ? (
                            <button
                                className='flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-8 py-3 min-w-[200px] text-white font-semibold bg-red-600 hover:bg-red-700 hover:border-red-700 transform hover:scale-[1.03] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                onClick={(e) => handleBuyTicket(e, data._id)}
                            >
                                <FaShoppingCart /> Mua vé ngay
                            </button>
                        ) : (
                            <button
                                className='border-2 border-gray-300 rounded-lg px-8 py-3 min-w-[200px] text-gray-500 font-semibold bg-gray-100 cursor-not-allowed text-lg'
                                disabled
                            >
                                {getStatusLabel(data.status)}
                            </button>
                        )}
                    </div>
                    {/* Mô tả phim */}
                    <div className='mt-5'>
                        <h3 className='text-gray-800 font-semibold text-xl border-b border-gray-200 pb-2 mb-3'>Nội dung phim</h3>
                        <p className='text-gray-700 leading-relaxed text-base whitespace-pre-line'> {/* whitespace-pre-line để giữ xuống dòng từ DB */}
                            {data.description || "Chưa có mô tả."}
                        </p>
                    </div>
                </div>
            </div>

            {/* === Phim cùng thể loại === */}
            {data.category && (
                 // Thêm nền, padding và bo tròn cho phần này
                <div className="mt-12 pt-8 pb-10 border-t border-gray-200 bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 rounded-b-lg shadow-inner">
                    <CategoryWiseProductDisplay
                        category={data.category}
                        heading={"Phim cùng thể loại"}
                        currentMovieId={data._id}
                    />
                </div>
            )}

            {/* === Phần Bình luận === */}
            {data._id && (
                 <div className="mt-12 pt-8 border-t border-gray-200">
                    <CommentSection
                        movieId={data._id}
                        onCountChange={handleCommentCountChange}
                    />
                 </div>
            )}
        </div>
    );
};

export default ProductDetails;
// --- END OF FILE pages/ProductDetails.js ---