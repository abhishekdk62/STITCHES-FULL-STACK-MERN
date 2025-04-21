import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar"; // Import your custom Sidebar
import Header from "../../components/user/common/Header";
import Category from "../../components/admin/category/Category";
import Customer from "../../components/admin/user/UserList";
import Products from "../../components/admin/orders/Products";
import Coupons from "../../components/admin/coupon/Coupons";
import Orders from "../../components/admin/orders/Orders";
import OrdersInfo from "../../components/admin/orders/OrdersInfo";
import AdminReturnRequests from "../../components/admin/orders/AdminReturnRequests";
import Offers from "../../components/admin/offer/Offers";
import Report from "../../components/admin/report/Report";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab"));
  useEffect(()=>{
    localStorage.setItem("activeTab",activeTab)
  },[activeTab])
  const[selectedTab,setSelectedTab]=useState("view")
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          {activeTab === "customer" && <Customer />}
          {activeTab === "category" && <Category />}
          {activeTab === "products" && <Products />}
          {activeTab === "coupon" && <Coupons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
          {activeTab === "order" && <Orders activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeTab === "orderInfo" && <OrdersInfo activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeTab === "returns" && <AdminReturnRequests activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeTab === "offers" && <Offers activeTab={activeTab} setActiveTab={setActiveTab} />}
          {activeTab === "report" && <Report activeTab={activeTab} setActiveTab={setActiveTab} />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
