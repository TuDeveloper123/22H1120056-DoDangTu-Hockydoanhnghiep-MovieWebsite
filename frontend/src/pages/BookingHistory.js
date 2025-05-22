// LỊCH SỬ ĐẶT VÉ - ADMIN
import React, { useEffect, useState } from 'react';
    import SummaryApi from '../common';
    import { toast } from 'react-toastify';
    import moment from 'moment'; // Để định dạng ngày
    import 'moment/locale/vi'; // Import locale tiếng Việt cho moment
    import displayINRCurrency from '../helpers/displayCurrency';

    moment.locale('vi'); // Set locale tiếng Việt

    const BookingHistory = () => {
        const [bookings, setBookings] = useState([]);
        const [loading, setLoading] = useState(true);

        const fetchBookingHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(SummaryApi.getBookingHistory.url, {
                    method: SummaryApi.getBookingHistory.method,
                    credentials: 'include'
                });
                const dataResponse = await response.json();
                if (dataResponse.success) {
                    setBookings(dataResponse.data);
                } else {
                    toast.error("Không thể tải lịch sử đặt vé: " + dataResponse.message);
                }
            } catch (error) {
                toast.error("Lỗi kết nối: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchBookingHistory();
        }, []);

        const getStatusStyle = (status) => {
            switch (status) {
                case 'booked': return 'text-yellow-600 bg-yellow-100';
                case 'checked-in': return 'text-green-600 bg-green-100';
                case 'cancelled': return 'text-red-600 bg-red-100';
                default: return 'text-gray-600 bg-gray-100';
            }
        };

        return (
            <div className='bg-white p-4 rounded shadow'>
                <h2 className='text-xl font-bold mb-4'>Lịch sử đặt vé</h2>

                {loading && <p className='text-center'>Đang tải dữ liệu...</p>}

                {!loading && bookings.length === 0 && (
                    <p className='text-center text-gray-500'>Chưa có lượt đặt vé nào.</p>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className='w-full min-w-[800px] userTable'> {/* Thêm min-width */}
                            <thead>
                                <tr className='bg-black text-white'>
                                    <th>STT</th>
                                    <th>Người đặt</th>
                                    <th>Email</th>
                                    <th>Tên phim</th>
                                    <th>Rạp</th>
                                    <th>Ghế</th>
                                    <th>Suất chiếu</th>
                                    <th>Bắp/Nước</th>
                                    <th>Tổng tiền</th>
                                    <th>Mã vé</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày đặt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking._id}>
                                        <td>{index + 1}</td>
                                        <td>{booking.userId?.name || 'N/A'}</td>
                                        <td>{booking.userId?.email || 'N/A'}</td>
                                        <td>{booking.movieId?.productName || 'N/A'}</td>
                                         <td>{booking.movieId?.cinemaHall || 'N/A'}</td>
                                        <td>{booking.seats?.join(', ') || 'N/A'}</td>
                                        <td>{booking.showtime}</td>
                                        <td>
                                            {booking.concessions?.popcorn && 'Bắp'}
                                            {booking.concessions?.popcorn && booking.concessions?.drink && ' + '}
                                            {booking.concessions?.drink && 'Nước'}
                                            {!booking.concessions?.popcorn && !booking.concessions?.drink && 'Không'}
                                        </td>
                                        <td>{displayINRCurrency(booking.totalAmount)}</td>
                                        <td className='font-mono text-xs'>{booking.ticketCode}</td>
                                        <td>
                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.bookingStatus)}`}>
                                                {booking.bookingStatus === 'booked' ? 'Đã đặt' : booking.bookingStatus === 'checked-in' ? 'Đã check-in' : booking.bookingStatus === 'cancelled' ? 'Đã hủy' : booking.bookingStatus}
                                            </span>
                                        </td>
                                        <td>{moment(booking.createdAt).format('L LTS')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    export default BookingHistory;