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
import ShowtimeSelectionModal from '../components/ShowtimeSelectionModal';

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
    const [activeImage, setActiveImage] = useState("");
    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
    const [zoomImage, setZoomImage] = useState(false);
    const navigate = useNavigate();

    const [commentCount, setCommentCount] = useState(0);
    const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);

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
            }
        } catch (error) {
            toast.error("Lỗi kết nối khi tải chi tiết phim.");
            console.error("Fetch Details Error:", error);
        } finally {
            setLoading(false);
        }
    }, [params?.id]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleMouseEnterProduct = (imageURL) => { setActiveImage(imageURL); };
    const handleZoomImage = useCallback((e) => {
        setZoomImage(true);
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setZoomImageCoordinate({ x, y });
      }, []);
    const handleLeaveImageZoom = () => { setZoomImage(false); };

    const handleBuyTicket = (e) => {
        e.preventDefault();
        if (!data) return;

        if (data.status === 'showing' || data.status === 'early_access') {
             if (data.showings && data.showings.length > 0) {
                setShowtimeModalOpen(true);
            } else {
                toast.info("Phim này hiện chưa có suất chiếu.");
            }
        } else if (data.status === 'upcoming') {
            toast.info("Phim này sắp chiếu, chưa mở bán vé.");
        } else {
            toast.error("Không thể mua vé cho phim này.");
        }
    };
     const handleCommentCountChange = useCallback((count) => {
      setCommentCount(count);
  }, []);

    if (loading) {
        return (
            <div className='container mx-auto p-4 md:p-6 min-h-[calc(100vh-120px)] flex items-center justify-center'>
                <CgSpinner size={40} className="animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 md:p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10'>
                <div className='flex flex-col-reverse md:flex-row gap-4 items-start'>
                    <div className='w-full md:w-24 flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible scrollbar-none md:max-h-[500px] flex-shrink-0'>
                        {data?.productImage?.map((imgURL, index) => (
                            <div
                                className={`bg-white p-1 rounded-md border-2 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${activeImage === imgURL ? 'border-red-500' : 'border-gray-200'}`}
                                key={imgURL + index}
                                onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                                onClick={() => handleMouseEnterProduct(imgURL)}
                            >
                                <img src={imgURL} alt={`thumbnail ${index+1}`} className='w-20 h-20 md:w-full md:h-auto object-contain' loading="lazy" />
                            </div>
                        ))}
                    </div>
                    <div className='w-full h-[400px] md:h-[500px] bg-gray-100 relative p-2 overflow-hidden rounded-lg shadow-md flex-grow'>
                        <img
                            src={activeImage}
                            alt={data?.productName}
                            className='h-full w-full object-contain transition-all duration-300 ease-in-out rounded-md'
                            onMouseMove={handleZoomImage}
                            onMouseLeave={handleLeaveImageZoom}
                        />
                        {zoomImage && activeImage && (
                            <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-100 p-1 -right-[510px] top-0 border border-slate-300 shadow-lg z-10 rounded-md'>
                                <div
                                    className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150 origin-top-left rounded'
                                    style={{
                                        backgroundImage: `url(${activeImage})`, backgroundRepeat: 'no-repeat',
                                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                                        backgroundSize: 'contain'
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <span className='bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block w-fit capitalize font-semibold text-sm tracking-wide'>
                        {getCategoryLabel(data.category)}
                    </span>
                    <h1 className='text-3xl lg:text-4xl font-bold text-gray-800 leading-tight'>
                        {data.productName}
                    </h1>
                    <div className="space-y-1.5 text-base text-gray-600 mt-1">
                        <p>Quốc gia / Đạo diễn: <span className='font-medium text-gray-800'>{data.brandName}</span></p>
                        
                        {/* ===== DÒNG NÀY ĐÃ BỊ XÓA BỎ ===== */}
                        {/* <p>Rạp: <span className='font-medium text-gray-800'>{data.cinemaHall}</span></p> */}

                        <p>Trạng thái: <span className='font-medium text-gray-800'>{getStatusLabel(data.status)}</span></p>
                    </div>
                    <div className='flex items-center gap-1.5 my-2'>
                        <div className="flex text-yellow-400">
                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalf />
                        </div>
                        <span className='text-gray-500 text-sm ml-1 font-medium'>(4.5/5 - {commentCount} đánh giá)</span>
                    </div>
                    <div className='flex items-center gap-3 my-3'>
                        <p className='text-red-600 text-3xl lg:text-4xl font-bold'>{displayINRCurrency(data.sellingPrice)}</p>
                    </div>
                    <div className='flex items-center gap-3 my-4'>
                         <button
                            className='flex items-center justify-center gap-2 border-2 border-red-600 rounded-lg px-8 py-3 min-w-[200px] text-white font-semibold bg-red-600 hover:bg-red-700 hover:border-red-700 transform hover:scale-[1.03] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={handleBuyTicket}
                            disabled={data.status === 'upcoming'}
                        >
                            <FaShoppingCart /> Mua vé ngay
                        </button>
                    </div>
                    <div className='mt-5'>
                        <h3 className='text-gray-800 font-semibold text-xl border-b border-gray-200 pb-2 mb-3'>Nội dung phim</h3>
                        <p className='text-gray-700 leading-relaxed text-base whitespace-pre-line'>
                            {data.description || "Chưa có mô tả."}
                        </p>
                    </div>
                </div>
            </div>

            {data.category && (
                <div className="mt-12 pt-8 pb-10 border-t border-gray-200 bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 rounded-b-lg shadow-inner">
                    <CategoryWiseProductDisplay
                        category={data.category}
                        heading={"Phim cùng thể loại"}
                        currentMovieId={data._id}
                    />
                </div>
            )}

            {data._id && (
                 <div className="mt-12 pt-8 border-t border-gray-200">
                    <CommentSection
                        movieId={data._id}
                        onCountChange={handleCommentCountChange}
                    />
                 </div>
            )}
            
            {showtimeModalOpen && (
                <ShowtimeSelectionModal
                    movie={data}
                    onClose={() => setShowtimeModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProductDetails;