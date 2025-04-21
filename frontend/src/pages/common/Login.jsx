import React, { useState } from "react";
import LoginForm from "../../components/common/auth/LoginForm";
import ForgotPassword from "../../components/common/auth/ForgotPassword";
import Header from "../../components/common/utils/Header";

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
