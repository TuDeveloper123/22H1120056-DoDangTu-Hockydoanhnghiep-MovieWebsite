import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';

// --- Constants ---
const SEAT_PRICE = 45000;
const POPCORN_PRICE = 50000;
const DRINK_PRICE = 50000;
const COMBO_PRICE = 90000;
const MAX_SEATS = 3;

// --- Helper Function để tạo nhiều ghế hơn ---
// Tăng số hàng và số ghế mỗi hàng để giống rạp thật
const generateSeats = (rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], seatsPerRow = 16) => {
    const seats = [];
    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            seats.push(`${row}${String(i).padStart(2, '0')}`);
        }
    });
    return seats;
};

const ALL_SEATS = generateSeats();
const seatColumns = 16; // Số cột để render grid, khớp với seatsPerRow ở trên

// --- Component ---
const BookingPage = () => {
    // Nhận id phim, tên rạp và giờ chiếu từ URL
    const { id: movieId, cinema: cinemaNameParam, showtime: showtimeParam } = useParams();
    // Giải mã các tham số từ URL (quan trọng vì tên rạp có thể chứa dấu cách)
    const cinemaName = decodeURIComponent(cinemaNameParam);
    const showtime = decodeURIComponent(showtimeParam);

    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSeats, setLoadingSeats] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [concessions, setConcessions] = useState({ popcorn: false, drink: false });
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookedSeats, setBookedSeats] = useState([]);

    // --- Fetch Movie Details và Booked Seats ---
    const fetchBookingData = useCallback(async () => {
        setLoading(true);
        setLoadingSeats(true);
        let movieDetailsLoaded = false;
        let movieResponse;

        try {
            // Fetch movie details
            movieResponse = await fetch(SummaryApi.productDetails.url, {
                method: SummaryApi.productDetails.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ productId: movieId })
            });
            const movieDataResponse = await movieResponse.json();

            if (movieDataResponse.success) {
                setMovie(movieDataResponse.data);
                movieDetailsLoaded = true;
            } else {
                toast.error("Không thể tải thông tin phim.");
                navigate('/');
                setLoading(false);
                return;
            }

            // Fetch booked seats chỉ khi movie details đã load thành công
            if (movieDetailsLoaded) {
                try {
                    // Xây dựng URL động với các tham số đã được mã hóa
                    const url = `${SummaryApi.getBookedSeats.url}/${movieId}/${encodeURIComponent(cinemaName)}/${encodeURIComponent(showtime)}`;
                    const bookedSeatsResponse = await fetch(url);
                    const bookedSeatsDataResponse = await bookedSeatsResponse.json();

                    if (bookedSeatsDataResponse.success) {
                        setBookedSeats(bookedSeatsDataResponse.data);
                    } else {
                        console.error("Lỗi lấy ghế đã đặt:", bookedSeatsDataResponse.message);
                    }
                } catch (seatError) {
                    console.error("Lỗi kết nối khi lấy ghế đã đặt:", seatError.message);
                } finally {
                    setLoadingSeats(false);
                }
            }
        } catch (error) {
            toast.error("Lỗi kết nối: " + error.message);
            navigate('/');
        } finally {
            if (movieDetailsLoaded || (movieResponse && !movieResponse.ok)) {
                setLoading(false);
            }
            if (!movieDetailsLoaded) {
                setLoadingSeats(false);
            }
        }
    }, [movieId, cinemaName, showtime, navigate]);

    useEffect(() => {
        fetchBookingData();
    }, [fetchBookingData]);


    // --- Tính tổng tiền ---
    useEffect(() => {
        let currentTotal = selectedSeats.length * SEAT_PRICE;
        if (concessions.popcorn && concessions.drink) {
            currentTotal += COMBO_PRICE;
        } else {
            if (concessions.popcorn) currentTotal += POPCORN_PRICE;
            if (concessions.drink) currentTotal += DRINK_PRICE;
        }
        setTotalAmount(currentTotal);
    }, [selectedSeats, concessions]);

    // --- Xử lý chọn ghế ---
    const handleSeatChange = (event) => {
        const seatValue = event.target.value;
        if (bookedSeats.includes(seatValue)) return;

        setSelectedSeats(prevSeats => {
            if (prevSeats.includes(seatValue)) {
                return prevSeats.filter(seat => seat !== seatValue);
            }
            if (prevSeats.length >= MAX_SEATS) {
                toast.info(`Bạn chỉ có thể chọn tối đa ${MAX_SEATS} ghế.`);
                return prevSeats;
            }
            return [...prevSeats, seatValue].sort();
        });
    };

    // --- Xử lý chọn bắp nước ---
    const handleConcessionChange = (event) => {
        const { name, checked } = event.target;
        setConcessions(prev => ({ ...prev, [name]: checked }));
    };

    // --- Xử lý submit đặt vé ---
    const handleBookingSubmit = async (event) => {
        event.preventDefault();
        if (selectedSeats.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 ghế.");
            return;
        }

        const conflictSeats = selectedSeats.filter(seat => bookedSeats.includes(seat));
        if (conflictSeats.length > 0) {
            toast.error(`Ghế ${conflictSeats.join(', ')} vừa có người khác đặt. Vui lòng chọn lại.`);
            fetchBookingData(); // Tải lại dữ liệu ghế
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(SummaryApi.createBooking.url, {
                method: SummaryApi.createBooking.method,
                headers: { "content-type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    movieId: movieId,
                    cinemaName: cinemaName,
                    seats: selectedSeats,
                    showtime: showtime,
                    concessions: concessions,
                    totalAmount: totalAmount
                })
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                toast.success(`Đặt vé thành công! Mã vé của bạn: ${dataResponse.data.ticketCode}`);
                navigate('/');
            } else {
                toast.error(`Đặt vé thất bại: ${dataResponse.message}`);
                if (dataResponse.message.includes("đã có người đặt")) {
                    fetchBookingData(); // Tải lại ghế nếu có lỗi trùng ghế
                }
            }
        } catch (error) {
            toast.error("Lỗi kết nối khi đặt vé: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !movie) {
        return <div className='container mx-auto p-4 text-center text-xl'>Đang tải thông tin đặt vé...</div>;
    }

    return (
        <div className='container mx-auto p-4 md:p-6'>
            <h1 className='text-3xl font-bold mb-2 text-center'>{movie?.productName || 'Đặt vé phim'}</h1>
            <p className='text-center text-lg mb-2'>Rạp: <span className='font-semibold'>{cinemaName}</span> | Suất chiếu: <span className='font-semibold'>{showtime}</span></p>
            <p className='text-center text-lg mb-6'>Giá vé: {displayINRCurrency(SEAT_PRICE)} / ghế</p>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
                {/* --- Cột chọn ghế --- */}
                <div className='lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-md'>
                    <h2 className='text-xl font-semibold mb-4'>Chọn ghế (Tối đa {MAX_SEATS})</h2>
                    <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs mb-4'>
                        <div className='flex items-center gap-1'><span className='w-4 h-4 rounded border border-green-300 bg-green-100 block'></span> Ghế trống</div>
                        <div className='flex items-center gap-1'><span className='w-4 h-4 rounded border border-red-700 bg-red-600 block'></span> Ghế đang chọn</div>
                        <div className='flex items-center gap-1'><span className='w-4 h-4 rounded border border-gray-500 bg-gray-400 block line-through'></span> Ghế đã đặt</div>
                    </div>
                    <div className='w-full h-2 bg-gray-700 rounded-t-md mb-6 text-center text-white text-xs relative'>
                        <span className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 px-2 rounded-b'>Màn hình</span>
                    </div>

                    {loadingSeats ? (
                        <div className='text-center p-5'>Đang tải sơ đồ ghế...</div>
                    ) : (
                        <div className={`grid gap-1.5 md:gap-2`} style={{ gridTemplateColumns: `repeat(${seatColumns}, minmax(0, 1fr))` }}>
                            {ALL_SEATS.map(seat => {
                                const isSelected = selectedSeats.includes(seat);
                                const isBooked = bookedSeats.includes(seat);
                                return (
                                    <button
                                        key={seat}
                                        value={seat}
                                        onClick={handleSeatChange}
                                        disabled={isBooked || loading}
                                        aria-pressed={isSelected}
                                        aria-label={`Ghế ${seat} ${isBooked ? 'đã đặt' : isSelected ? 'đang chọn' : 'trống'}`}
                                        className={`
                                            p-1 md:p-2 border rounded text-center text-xs font-medium transition-all duration-150 ease-in-out aspect-square flex items-center justify-center
                                            focus:outline-none focus:ring-2 focus:ring-offset-1
                                            ${isBooked
                                                ? 'bg-gray-400 text-gray-600 border-gray-500 cursor-not-allowed line-through'
                                                : isSelected
                                                    ? 'bg-red-600 text-white border-red-700 ring-red-500'
                                                    : 'bg-green-100 text-green-900 border-green-300 hover:bg-green-200 hover:border-green-400 ring-green-500'
                                            }
                                            ${loading ? 'opacity-70 cursor-wait' : ''}
                                        `}
                                    >
                                        {seat}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    <div className='mt-6 border-t pt-4'>
                        <p className='font-medium'>Ghế đã chọn ({selectedSeats.length}/{MAX_SEATS}): <span className='text-red-600 font-semibold'>{selectedSeats.join(', ') || 'Chưa chọn'}</span></p>
                    </div>
                </div>

                {/* --- Cột chọn bắp nước và thanh toán --- */}
                <div className='bg-white p-4 md:p-6 rounded-lg shadow-md lg:sticky lg:top-20' style={{ alignSelf: 'start' }}>
                    <h2 className='text-xl font-semibold mb-4'>Chọn Bắp / Nước</h2>
                    <div className='space-y-3 mb-6'>
                        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded'>
                            <input
                                type="checkbox" name="popcorn" checked={concessions.popcorn} onChange={handleConcessionChange} disabled={loading}
                                className='w-5 h-5 accent-red-600 cursor-pointer'
                            />
                            <span>Bắp rang ({displayINRCurrency(POPCORN_PRICE)})</span>
                        </label>
                        <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded'>
                            <input
                                type="checkbox" name="drink" checked={concessions.drink} onChange={handleConcessionChange} disabled={loading}
                                className='w-5 h-5 accent-red-600 cursor-pointer'
                            />
                            <span>Nước ngọt ({displayINRCurrency(DRINK_PRICE)})</span>
                        </label>
                        {concessions.popcorn && concessions.drink && (
                            <p className='text-sm text-green-600 font-medium ml-2'>*Đã áp dụng giá combo Bắp + Nước: {displayINRCurrency(COMBO_PRICE)}</p>
                        )}
                    </div>

                    <hr className='my-4' />

                    <h2 className='text-xl font-semibold mb-4'>Tổng cộng</h2>
                    <div className='space-y-1 text-gray-700 mb-6'>
                        <p className='flex justify-between'><span>Tiền vé ({selectedSeats.length} ghế):</span> <span>{displayINRCurrency(selectedSeats.length * SEAT_PRICE)}</span></p>
                        <p className='flex justify-between'><span>Tiền bắp/nước:</span> <span>{displayINRCurrency(totalAmount - selectedSeats.length * SEAT_PRICE)}</span></p>
                        <hr className='my-2' />
                        <p className='flex justify-between text-xl font-bold text-red-600 mt-2'><span>Tổng thanh toán:</span> <span>{displayINRCurrency(totalAmount)}</span></p>
                    </div>

                    <button
                        onClick={handleBookingSubmit}
                        disabled={loading || selectedSeats.length === 0 || loadingSeats}
                        className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;