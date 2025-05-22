// LỊCH SỬ ĐẶT VÉ CỦA TÔI
import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/vi';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import { CgSpinner } from 'react-icons/cg'; // Icon loading
import { FaTicketAlt, FaCalendarAlt, FaClock, FaChair, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaBarcode } from 'react-icons/fa'; // Thêm icons

moment.locale('vi');

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.myBookings.url, {
                method: SummaryApi.myBookings.method,
                credentials: 'include'
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setBookings(dataResponse.data);
            } else {
                toast.error("Không thể tải lịch sử đặt vé: " + dataResponse.message);
                setBookings([]); // Đảm bảo là mảng rỗng nếu lỗi
            }
        } catch (error) {
            toast.error("Lỗi kết nối: " + error.message);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    // Cải thiện style cho status badge
    const getStatusInfo = (status) => {
        switch (status) {
            case 'booked':
                return { style: 'bg-yellow-100 text-yellow-800 border border-yellow-300', label: 'Đã đặt', icon: <FaClock className="mr-1" /> };
            case 'checked-in':
                return { style: 'bg-green-100 text-green-800 border border-green-300', label: 'Đã check-in', icon: <FaCheckCircle className="mr-1" /> };
            case 'cancelled':
                return { style: 'bg-red-100 text-red-800 border border-red-300', label: 'Đã hủy', icon: <FaTimesCircle className="mr-1" /> };
            default:
                return { style: 'bg-gray-100 text-gray-800 border border-gray-300', label: status.toUpperCase(), icon: <FaQuestionCircle className="mr-1" /> };
        }
    };

    return (
        <div className='container mx-auto p-4 md:p-6 min-h-[calc(100vh-120px)]'>
            <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>Lịch sử đặt vé của bạn</h1>

            {loading && (
                 <div className='flex justify-center items-center min-h-[200px]'>
                    <CgSpinner size={40} className="animate-spin text-red-600"/>
                 </div>
            )}

            {!loading && bookings.length === 0 && (
                 <div className='text-center text-gray-500 text-lg mt-10 bg-white p-10 rounded-lg shadow'>
                     <FaTicketAlt size={40} className="mx-auto mb-4 text-gray-400"/>
                     Bạn chưa đặt vé nào.
                 </div>
            )}

            {!loading && bookings.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"> {/* Grid layout cho thẻ */}
                    {bookings.map((booking) => {
                        const statusInfo = getStatusInfo(booking.bookingStatus);
                        return (
                            // --- Thẻ vé ---
                            <div key={booking._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col md:flex-row">
                                {/* Poster Phim */}
                                <div className="md:w-1/3 lg:w-2/5 flex-shrink-0 bg-gray-100 relative overflow-hidden">
                                    <Link to={`/product/${booking.movieId?._id}`} className="block h-full">
                                        <img
                                            src={booking.movieId?.productImage?.[0]}
                                            alt={booking.movieId?.productName || 'Movie Poster'}
                                            // Dùng object-cover để lấp đầy, thêm hiệu ứng khi hover
                                            className="object-cover w-full h-48 md:h-full transition-transform duration-300 ease-in-out hover:scale-105"
                                            loading="lazy"
                                        />
                                    </Link>
                                    {/* Status Badge trên ảnh */}
                                    <div className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm ${statusInfo.style}`}>
                                         {statusInfo.icon} {statusInfo.label}
                                     </div>
                                </div>

                                {/* Chi tiết vé */}
                                <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        {/* Tên phim */}
                                        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-red-600 transition-colors">
                                            <Link to={`/product/${booking.movieId?._id}`}>
                                                {booking.movieId?.productName || 'Phim không xác định'}
                                            </Link>
                                        </h2>
                                        {/* Thông tin Rạp & Suất chiếu */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600 mb-3">
                                            <p className="flex items-center"><FaMapMarkerAlt className="mr-1.5 text-gray-400"/> Rạp: <span className='font-medium text-gray-700 ml-1'>{booking.movieId?.cinemaHall || 'N/A'}</span></p>
                                            <p className="flex items-center"><FaClock className="mr-1.5 text-gray-400"/> Suất: <span className='font-medium text-gray-700 ml-1'>{booking.showtime}</span></p>
                                        </div>
                                        {/* Ghế */}
                                        <p className="mb-3 flex items-start">
                                            <FaChair className="mr-1.5 text-gray-400 mt-0.5 flex-shrink-0"/>
                                            <span className="text-sm text-gray-600 mr-1">Ghế:</span>
                                            <span className='font-semibold text-red-600 text-base leading-tight flex flex-wrap gap-1'>
                                                {booking.seats?.map(seat => <span key={seat} className="bg-red-50 px-1.5 py-0.5 rounded border border-red-100">{seat}</span>) || 'N/A'}
                                            </span>
                                        </p>
                                        {/* Bắp nước */}
                                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                                            <FaTicketAlt className="mr-1.5 text-gray-400 transform rotate-90"/> {/* Icon tạm */}
                                            Bắp/Nước:
                                            <span className='font-medium text-gray-700 ml-1'>
                                                {booking.concessions?.popcorn && ' Bắp'}
                                                {booking.concessions?.popcorn && booking.concessions?.drink && ' + '}
                                                {booking.concessions?.drink && ' Nước'}
                                                {!booking.concessions?.popcorn && !booking.concessions?.drink && ' Không'}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Phần dưới của thẻ */}
                                    <div className='mt-4 pt-4 border-t border-gray-200'>
                                        <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-4">
                                            {/* Tổng tiền */}
                                             <p className="flex items-center text-sm text-gray-600">
                                                 <FaMoneyBillWave className="mr-1.5 text-green-500"/> Tổng tiền:
                                                 <span className='font-bold text-lg text-green-600 ml-1'>{displayINRCurrency(booking.totalAmount)}</span>
                                             </p>
                                             {/* Ngày đặt */}
                                            <p className="flex items-center text-xs text-gray-500">
                                                 <FaCalendarAlt className="mr-1.5"/> Ngày đặt: {moment(booking.createdAt).format('L')}
                                            </p>
                                        </div>
                                        {/* Mã vé */}
                                        <p className="mt-3 text-sm text-gray-600 flex items-center">
                                            <FaBarcode className="mr-1.5 text-gray-400"/> Mã vé:
                                             <span className='ml-1 font-mono text-sm bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-800 tracking-wider'>{booking.ticketCode}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            // --- Hết thẻ vé ---
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
// --- END OF FILE pages/MyBookings.js ---