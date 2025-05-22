//TRANG CHỦ
import React from 'react';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';

const Home = () => {
  return (
    <div>
      <BannerProduct />
      <CategoryList />

      {/* Hiển thị phim theo thể loại */}
      <VerticalCardProduct category={"action"} heading={"Phim Hành Động"} />
      <VerticalCardProduct category={"horror"} heading={"Phim Kinh Dị"} />
      <VerticalCardProduct category={"comedy"} heading={"Phim Hài"} />
      <VerticalCardProduct category={"romance"} heading={"Phim Tình Cảm"} />
      <VerticalCardProduct category={"family"} heading={"Phim Gia Đình"} />
      <VerticalCardProduct category={"drama"} heading={"Phim Tâm Lý"} />

      {/* Optional: Hiển thị theo trạng thái (nếu backend hỗ trợ) */}
      {/*
      <VerticalCardProduct status={"showing"} heading={"Phim Đang Chiếu"}/>
      <VerticalCardProduct status={"early_access"} heading={"Phim Chiếu Sớm"}/>
      <VerticalCardProduct status={"upcoming"} heading={"Phim Sắp Chiếu"}/>
      */}
    </div>
  );
};

export default Home;