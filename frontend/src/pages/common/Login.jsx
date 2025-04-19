import React, { useState } from "react";
import Header from "../../components/common/Header";
import LoginForm from "../../components/common/LoginForm";
import ForgotPassword from "../../components/common/ForgotPassword";

const Login = () => {
  const [forgotPassword, setForgotPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        {forgotPassword ? (
          <ForgotPassword setForgotPassword={setForgotPassword} />
        ) : (
          <LoginForm setForgotPassword={setForgotPassword} />
        )}
      </div>
    </div>
  );
};

export default Login;
