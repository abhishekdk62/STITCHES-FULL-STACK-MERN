import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";

import MyInfo from "../../components/user/editInfo/MyInfo";
import Sidebar from "../../components/user/Sidebar";
import Header from "../../components/user/common/Header";
import Wishlist from "../../components/user/wishlist/Wishlist";
import EditInfo from "../../components/user/editInfo/EditInfo";
import Cart from "../../components/user/cart/Cart";
import Coupon from "../../components/user/coupon/Coupon";
import Orders from "../../components/user/order/Orders";
import OrderInfo from "../../components/user/order/OrderInfo";
import Wallet from "../../components/user/wallet/Wallet";
import AddaddressCheckout from "../../components/user/editinfo/AddAddressCheckout";
import EditAddress from "../../components/user/editinfo/EditAddress";
import PromotionalBanner from "../../components/user/common/PromotionalBanner";


const Account = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const [address, setAddress] = useState();
    const [selectedCategory, setSelectedCategory] = useState(null);

  return ( 
    <div>
      <PromotionalBanner />
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          <Sidebar />
          {selectedTab === "myinfo" ? (
            <MyInfo />
          ) : selectedTab === "wishlist" ? (
            <Wishlist />
          ) : selectedTab === "editinfo" ? (
            <EditInfo setAddress={setAddress} />
          ) : selectedTab === "cart" ? (
            <Cart />
          ) : selectedTab === "coupons" ? (
            <Coupon />
          ) : selectedTab === "orders" ? (
            <Orders />
          ) : selectedTab === "address" ? (
            <AddAddress />
          ) : selectedTab === "editaddress" ? (
            <EditAddress address={address} />
          ): selectedTab === "wallet" ? (
            <Wallet />
          ):selectedTab === "orderinfo"?<OrderInfo />: null}
        </div>
      </div>
    </div>
  );
};

export default Account;
