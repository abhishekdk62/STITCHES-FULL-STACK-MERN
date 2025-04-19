import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";

import MyInfo from "../../components/user/MyInfo";
import Sidebar from "../../components/user/Sidebar";
import Header from "../../components/user/Header";
import Wishlist from "../../components/user/Wishlist";
import EditInfo from "../../components/user/EditInfo";
import Cart from "../../components/user/Cart";
import Coupon from "../../components/user/Coupon";
import Orders from "../../components/user/Orders";
import AddAddress from "../../components/user/AddAddress";
import EditAddress from "../../components/user/EditAddress";
import CheckoutEditAddress from "../../components/user/CheckoutEditAddress";
import OrderInfo from "../../components/user/OrderInfo";
import Wallet from "../../components/user/Wallet";

const Account = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const [address, setAddress] = useState();

  return ( 
    <div>
      <Header />
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
