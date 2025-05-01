import React, { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, ArrowRight, Home, Phone, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShippingAddress,
  setShippingAddressEdit,
} from '../../../../slices/checkoutSlice';
import { useNavigate } from 'react-router-dom';
import { setSelectedTab } from '../../../../slices/selectedTabSlice';
import { getAddressApi } from '../../../services/addressService';
import { motion } from 'framer-motion';

const DeliveryAddress = ({ setStep, setShowCheckEditAddress }) => {
  const user = useSelector((state) => state.auth.user);
  const [address, setAddress] = useState();
  const shippingAddress = useSelector(
    (state) => state.checkout.shippingAddress
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(address);
    
  },[address])
  useEffect(() => {
    if (address) {
      dispatch(setShippingAddress(address[0]));
    }
  }, [address]);

  const getAddress = async () => {
    try {
      const response = await getAddressApi();
      setAddress(response.user.addresses);
      console.log(address);
    } catch (error) {
      console.log(error);
    }
  };
  const [err,setError]=useState(null)

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="md:p-8 p-3 bg-gray-50 min-h-screen w-full mx-auto rounded-xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 "
      >
        <div className="flex  items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-gray-700" />
          <h3 className="md:text-lg text-sm font-semibold">
            Select Delivery Address
          </h3>
        </div>

        <div className="space-y-6 bg-gray-50 md:p-6 rounded-lg ">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <p className="sm:text-base text-sm">Saved Addresses</p>
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCheckEditAddress('addaddress')}
              className="flex sm:text-base text-sm items-center  gap-2 sm:px-4 sm:py-2 px-2 py-1 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              Add New
            </motion.button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {address?.map((address, indx) => {
              const isSelected = shippingAddress?._id === address?._id;

              return (
                <motion.div
                  key={address?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + indx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(setShippingAddress(address))}
                    className={`p-6 rounded-lg h-80  transition-all duration-300 border ${
                      isSelected
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 bg-white '
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">
                        {address?.fullName}
                      </h4>
                      <div className="flex gap-2">
                        {indx === 0 && (
                          <span className="bg-black text-white text-[10px] px-1 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        {isSelected && (
                          <span className="bg-blue-400 text-white text-[10px] px-1 py-0.5 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <Phone className="w-4 h-4 text-gray-500 mt-1" />
                      <p className="text-gray-700">{address?.phone}</p>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <Home className="w-4 h-4 text-gray-500 mt-1" />
                      <p className="text-sm md:text-base text-gray-700">
                        {address?.street}, {address?.city}, {address?.state},{' '}
                        {address?.country}, {address?.zipCode}
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 text-sm md:text-base bg-gray-100 rounded-md  font-medium text-gray-700">
                        {address?.addressType}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setShippingAddressEdit(address));
                          setShowCheckEditAddress('checkoutEditAddress');
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:border-blue-600 hover:text-blue-600 transition-colors duration-300"
                      >
                        EDIT
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {err&&<p className='text-red-500 uppercase text-center text-base'>{err}</p>}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch(setSelectedTab('cart'));
              navigate(-1);
            }}
            className="flex text-sm sm:text-base sm:px-6 px-3 py-2 sm:py-3 items-center gap-2  rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            <ArrowLeft size={16} /> Back to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if(address.length==0)
              {
                 return setError("Please select an address")
              }
          
              setStep(2);
              setError(null)
            }}
            className={`flex items-center gap-2 text-sm sm:text-base sm:px-6 px-3 py-2 sm:py-3 rounded-md ${address?.length==0?"bg-gray-500":"bg-black hover:bg-gray-800"} text-white  transition-colors duration-300`}
          >
            Continue <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DeliveryAddress;
