import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';

const ShowtimeSelectionModal = ({ movie, onClose }) => {
    const [selectedCinema, setSelectedCinema] = useState(null);
    const navigate = useNavigate();

    if (!movie || !movie.showings || movie.showings.length === 0) {
        return null;
    }

    const handleShowtimeSelect = (cinemaName, showtime) => {
        // Chuyển hướng đến trang đặt vé với đầy đủ thông tin
        navigate(`/booking/${movie._id}/${encodeURIComponent(cinemaName)}/${encodeURIComponent(showtime)}`);
    };

    return (
        <div className='fixed w-full h-full bg-slate-800 bg-opacity-70 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 p-4'>
            <div className='bg-white p-4 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='flex justify-between items-center pb-3 border-b mb-4'>
                    <h2 className='font-bold text-xl text-gray-800'>Chọn suất chiếu</h2>
                    <button
                        className='text-2xl hover:text-red-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors'
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <CgClose />
                    </button>
                </div>

                {/* Content */}
                <div className='overflow-y-auto flex-grow'>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">{movie.productName}</h3>
                    </div>
                    <div className="space-y-4">
                        {movie.showings.map((showing, index) => (
                            <div key={index} className="border rounded-lg p-3">
                                <button
                                    className="w-full text-left font-semibold text-md"
                                    onClick={() => setSelectedCinema(selectedCinema === showing.cinemaName ? null : showing.cinemaName)}
                                >
                                    {showing.cinemaName}
                                </button>
                                {selectedCinema === showing.cinemaName && (
                                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {showing.showtimes.map((time, timeIndex) => (
                                            <button
                                                key={timeIndex}
                                                onClick={() => handleShowtimeSelect(showing.cinemaName, time)}
                                                className="bg-red-50 text-red-700 border border-red-200 rounded-md py-2 px-3 hover:bg-red-600 hover:text-white transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-1"
                                            >
                                                <FaTicketAlt /> {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowtimeSelectionModal;