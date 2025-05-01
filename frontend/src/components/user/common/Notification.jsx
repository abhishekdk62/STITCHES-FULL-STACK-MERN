import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const Notification = ({ p1, p2, icon ,shape=false}) => {
  return (
    <div className={`w-full  min-h-[60vh] flex flex-col justify-center ${shape?null:"h-full"} items-center`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center justify-center gap-4 p-8"
      >
       <div>
       {React.cloneElement(icon, {
          className: 'w-6 h-6 md:w-8 md:h-8 lg:w-14 lg:h-14 text-gray-700',
        })}
       </div>
       <div>
       <h2 className="md:text-2xl text-center font-bold text-black mb-2">{p1}</h2>
       <p className="text-gray-500 md:text-base text-sm text-center">{p2}</p>
       </div>
      </motion.div>
    </div>
  );
};
export default Notification;
