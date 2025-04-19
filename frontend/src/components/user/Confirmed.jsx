import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setSelectedTab } from "../../../slices/selectedTabSlice";
import { useNavigate } from "react-router-dom";
const Particle = ({ index, color = "black" }) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = 40 + Math.random() * 60;
  const size = 6 + Math.random() * 6;
  const duration = 0.6 + Math.random() * 0.8;
  const delay = Math.random() * 0.2;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        originX: 0.5,
        originY: 0.5,
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

const Confirmed = () => {
  const [showParticles, setShowParticles] = useState(false);
  const [replay, setReplay] = useState(false);

  // Trigger animation on initial load and when replay toggles
  useEffect(() => {
    setShowParticles(true);

    // Hide particles after animation completes
    const timer = setTimeout(() => {
      setShowParticles(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [replay]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const continueShoping = () => {
    navigate("/user/home");
  };
  const viewOrder = () => {
    dispatch(setSelectedTab("orders"));
    navigate("/user/account");
  };
  return (
    <div className="flex items-center w-full  justify-center h-130 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white">
        <div className="flex flex-col items-center">
          {/* Check icon with particles */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <img
                  className="h-19 w-19 animate-bounce"
                  src="https://static.thenounproject.com/png/626032-200.png"
                  alt=""
                />
                {/* <Check className="w-8 h-8 text-white" /> */}
              </motion.div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              {showParticles &&
                Array.from({ length: 24 }).map((_, index) => (
                  <Particle key={index} index={index} />
                ))}
            </div>
          </div>

          <motion.h2
            className="mb-2 text-xl font-semibold text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Thank you!
          </motion.h2>

          <motion.p
            className="mb-6 text-sm text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your order is confirmed.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              className="px-2 py-2 text-sm font-medium text-gray-700 border border-gray-300  hover:bg-gray-50 flex-1"
              onClick={viewOrder}
            >
              VIEW ORDER
            </button>
            <button
              onClick={continueShoping}
              className="px-2 py-2 text-sm font-medium text-white  bg-black hover:bg-black flex-1"
            >
              CONTINUE SHOPPING
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Confirmed;
