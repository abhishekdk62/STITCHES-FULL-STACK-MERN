import React from "react";

const PleaseLogin = () => {
  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center">
      <h1 className="text-black text-3xl">Please Login First</h1>
      <button className="bg-black text-white hover:bg-white hover:border hover:text-black p-5">
        Login
      </button>
    </div>
  );
};

export default PleaseLogin;
