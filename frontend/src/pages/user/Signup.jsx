import React from 'react';
import SignUpForm from '../../components/user/auth/SignUpForm';
import Header from '../../components/common/utils/Header';

const SignUp = () => {
  return (
    <div className="overflow-hidden">
      <Header />
      <SignUpForm />
    </div>
  );
};

export default SignUp;
