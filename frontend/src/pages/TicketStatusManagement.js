// File Path: frontend/src/pages/TicketStatusManagement.js

import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const TicketStatusManagement = () => {
    const [pendingTickets, setPendingTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkingInId, setCheckingInId] = useState(null);

    const fetchPendingTickets = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getPendingTickets.url, {
                method: SummaryApi.getPendingTickets.method,
                credentials: 'include'
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setPendingTickets(dataResponse.data);
            } else {
                toast.error("Không thể tải vé chờ check-in: " + dataResponse.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTickets();
    }, []);

    const handleCheckIn = async (bookingId) => {
        if (checkingInId) return;
        setCheckingInId(bookingId);
        try {
            const response = await fetch(SummaryApi.checkInTicket.url, {
                method: SummaryApi.checkInTicket.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookingId: bookingId })
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                toast.success(dataResponse.message);
                setPendingTickets(prev => prev.filter(ticket => ticket._id !== bookingId));
            } else {
                toast.error("Check-in thất bại: " + dataResponse.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối khi check-in: " + error.message);
        } finally {
             setCheckingInId(null);
        }
    };

    return (
        <div className='bg-white p-4 rounded shadow'>
            <h2 className='text-xl font-bold mb-4'>Quản lý trạng thái vé (Chờ Check-in)</h2>

            {loading && <p className='text-center'>Đang tải dữ liệu...</p>}

            {!loading && pendingTickets.length === 0 && (
                <p className='text-center text-gray-500'>Không có vé nào đang chờ check-in.</p>
            )}

            {!loading && pendingTickets.length > 0 && (
                 <div className="overflow-x-auto">
                    <table className='w-full min-w-[800px] userTable'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th>STT</th>
                                <th>Khách hàng</th>
                                <th>Phim</th>
                                <th>Rạp</th>
                                <th>Ghế</th>
                                <th>Suất chiếu</th>
                                <th>Mã vé</th>
                                <th>Ngày đặt</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingTickets.map((ticket, index) => (
                                <tr key={ticket._id}>
                                    <td>{index + 1}</td>
                                    <td>{ticket.userId?.name || 'N/A'}</td>
                                    <td>{ticket.movieId?.productName || 'N/A'}</td>
                                    {/* === SỬA Ở ĐÂY === */}
                                    <td>{ticket.cinemaName || 'N/A'}</td> 
                                    <td>{ticket.seats?.join(', ')}</td>
                                    <td>{ticket.showtime}</td>
                                    <td className='font-mono text-xs'>{ticket.ticketCode}</td>
                                    <td>{moment(ticket.createdAt).format('L LTS')}</td>
                                    <td>
                                        <button
                                            onClick={() => handleCheckIn(ticket._id)}
                                            disabled={checkingInId === ticket._id}
                                            className={`bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors ${checkingInId === ticket._id ? 'opacity-50 cursor-wait' : ''}`}
                                        >
                                            {checkingInId === ticket._id ? 'Đang xử lý...' : 'Check-in'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TicketStatusManagement;