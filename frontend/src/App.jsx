import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/common/Login";
import Home from "./pages/user/Home";
import SignUp from "./pages/user/Signup";
import PrivateRoute from "./protected/PrivateRoute";
import PublicRoute from "./protected/PublicRoute";
import React, { useEffect, useState } from "react";
import ProductsView from "./pages/user/ProductsView";
import ProductView from "./pages/user/ProductView";
import { login, logout } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { verifyUser } from "./services/authService";
import Account from "./pages/user/Account";
import Checkout from "./pages/user/Checkout";
import ProtectedCheckoutRoute from "./protected/ProtectedCheckoutRoute";
import ProtectUserFromAdmin from "./protected/ProtectUserFromAdmin";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentFailure from "./pages/Payment/PaymentFailure";
import OrderConfirmed from "./pages/Payment/OrderConfirmed";
import WalletSuccuss from "./pages/Payment/WalletSuccuss";
import WalletError from "./pages/Payment/WalletError";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { userId, role, user } = await verifyUser();

        dispatch(login({ userId, role, user })); 
      } catch (error) {
        if (error.message === "User blocked") {
          dispatch(logout());
          navigate("/");
        }
      }
    };
    checkUser();
  }, [dispatch, navigate]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
  

      <Route
        path="/product/:id"
        element={
          <ProtectUserFromAdmin>
            <ProductView />
          </ProtectUserFromAdmin>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectUserFromAdmin>
            <ProductsView />
          </ProtectUserFromAdmin>
        }
      />



      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/home"
        element={
          <ProtectUserFromAdmin>
            <Home />
          </ProtectUserFromAdmin>
        }
      />

      <Route
        path="/user/account"
        element={
          <ProtectUserFromAdmin>
            <Account />
          </ProtectUserFromAdmin>
        }
      />
      <Route
        path="/user/checkout"
        element={
          <ProtectedCheckoutRoute>
            <Checkout />
          </ProtectedCheckoutRoute>
        }
      />
      <Route
        path="/payment/failure"
        element={
            <PaymentFailure />
        }
      />
      <Route
        path="/payment/success"
        element={
            <PaymentSuccess />
        }
      />
      <Route
        path="/order/confirmed"
        element={
            <OrderConfirmed />
        }
      />
      <Route
        path="/wallet/payed"
        element={
            <WalletSuccuss />
        }
      />
      <Route
        path="/wallet/error"
        element={
            <WalletError />
        }
      />
    </Routes>
  );
}

export default App;
