// TẤT CẢ NGƯỜI DÙNG - ADMIN
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';


const AllUsers = () => {
    const [allUser,setAllUsers] = useState([])
    const [openUpdateRole,setOpenUpdateRole] = useState(false)
    const [updateUserDetails,setUpdateUserDetails] = useState({
        email : "",
        name : "",
        role : "",
        _id  : ""
    })

    const fetchAllUsers = async() =>{
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method : SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
            toast.error(dataResponse.message)
        }

    }

    useEffect(()=>{
        fetchAllUsers()
    },[])

    const [loadingDelete, setLoadingDelete] = useState(false);
    const currentUser = useSelector(state => state?.user?.user); // Lấy thông tin người dùng hiện tại

const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userToDelete.name}" không? Hành động này không thể hoàn tác.`)) {
        setLoadingDelete(true);
        try {
            const response = await fetch(SummaryApi.deleteUser.url, {
                method: SummaryApi.deleteUser.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: userToDelete._id })
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                toast.success(dataResponse.message);
                fetchAllUsers(); // Tải lại danh sách người dùng sau khi xóa
            } else {
                toast.error(dataResponse.message);
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
        setLoadingDelete(false);
    }
}

  return (
    <div className='bg-white pb-4'>
        <table className='w-full userTable'>
            <thead>
                <tr className='bg-black text-white'>
                    <th>Stt</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Ngày khởi tạo</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody className=''>
    {
        allUser.map((el,index) => {
            // Kiểm tra nếu dòng này là của admin đang đăng nhập
            const isCurrentUser = currentUser?._id === el._id;
            
            return(
                // Thêm một class để làm mờ dòng của chính admin
                <tr key={el._id} className={isCurrentUser ? 'bg-slate-100' : ''}>
                    <td>{index+1}</td>
                    <td>{el?.name}</td>
                    <td>{el?.email}</td>
                    <td>{el?.role}</td>
                    <td>{moment(el?.createdAt).format('LL')}</td>
                    <td className='flex items-center gap-2 justify-center'>
                        {/* Nút sửa vai trò */}
                        <button 
                            className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed' 
                            onClick={()=>{
                                setUpdateUserDetails(el)
                                setOpenUpdateRole(true)
                            }}
                            // Vô hiệu hóa nút sửa cho tài khoản của chính mình
                            disabled={isCurrentUser}
                            title={isCurrentUser ? "Không thể sửa vai trò của chính bạn" : "Sửa vai trò"}
                        >
                            <MdModeEdit/>
                        </button>
                        {/* Nút xóa người dùng */}
                        <button
                            className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => handleDeleteUser(el)}
                            // Vô hiệu hóa nút xóa cho tài khoản của chính mình
                            disabled={isCurrentUser || loadingDelete}
                            title={isCurrentUser ? "Không thể xóa chính bạn" : "Xóa người dùng"}
                        >
                            <MdDelete />
                        </button>
                    </td>
                </tr>
            )
        })
    }
</tbody>
        </table>

        {
            openUpdateRole && (
                <ChangeUserRole 
                    onClose={()=>setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )      
        }
    </div>
  )
}

export default AllUsers