import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar"; // Import your custom Sidebar


import Header from "../../components/common/utils/Header";


import Category from "../../components/admin/category/Category";
import Customer from "../../components/admin/user/UserList";
import Products from "../../components/admin/orders/Products";
import Coupons from "../../components/admin/coupon/Coupons";
import Orders from "../../components/admin/orders/Orders";
import OrdersInfo from "../../components/admin/orders/OrdersInfo";
import AdminReturnRequests from "../../components/admin/orders/AdminReturnRequests";
import Offers from "../../components/admin/offer/Offers";
import Report from "../../components/admin/report/Report";
import Transactions from "../../components/admin/transactions/Transactions";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("order");
 
  const[selectedTab,setSelectedTab]=useState("view")
  return (
    <>
      <Header />
      <div className="flex justify-center w-full">
        {/* Inner container with max-w-7xl */}
        <div className="flex w-full max-w-7xl">
          {/* Sidebar with fixed width or adjustable */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="w-64" // Adjust the width of the sidebar
          />
          
          {/* Main content section */}
          <div className="flex-1 w-full p-4">
            {activeTab === "customer" && <Customer />}
            {activeTab === "category" && <Category />}
            {activeTab === "products" && <Products />}
            {activeTab === "coupon" && <Coupons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
            {activeTab === "order" && <Orders activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === "orderInfo" && <OrdersInfo activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === "returns" && <AdminReturnRequests activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === "offers" && <Offers activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === "report" && <Report activeTab={activeTab} setActiveTab={setActiveTab} />}
            {activeTab === "transactions" && <Transactions activeTab={activeTab} setActiveTab={setActiveTab} />}
          </div>
        </div>
      </div>
    </>
  );

};

export default Dashboard;
