import React from "react";
import AddCoupon from "./elements/AddCoupon";
import EditCoupon from "./elements/EditCoupon";
import RemovedCoupons from "./elements/RemovedCoupons";
import CouponList from "./elements/CouponList";

const Coupons = ({ selectedTab, setSelectedTab }) => {
  return (
    <div>
      {selectedTab === "add" ? (
        <AddCoupon setSelectedTab={setSelectedTab} />
      ) : selectedTab === "edit" ? (
        <EditCoupon setSelectedTab={setSelectedTab} />
      ) : selectedTab === "removed" ? (
        <RemovedCoupons setSelectedTab={setSelectedTab} />
      ) : selectedTab === "view" ? (
        <CouponList setSelectedTab={setSelectedTab} />
      ) : null}
    </div>
  );
};

export default Coupons;