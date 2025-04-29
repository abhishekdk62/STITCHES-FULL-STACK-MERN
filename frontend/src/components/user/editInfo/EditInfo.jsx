import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Camera, User, Mail, MapPin, Phone, Home } from 'lucide-react';
import { setSelectedTab } from '../../../../slices/selectedTabSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { Eye, EyeOff } from 'lucide-react';
import { getAddressApi } from '../../../services/addressService';

import { Lock } from 'lucide-react';

import {
  requestEmailChange,
  verifyEmailOTP,
} from '../../../services/userService';

import { useDispatch, useSelector } from 'react-redux';
import {
  changePassword,
  deleteAddress,
  updateProfile,
} from '../../../services/userService';

const EditInfo = ({ setAddress }) => {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstname);
  const [lastName, setLastName] = useState(user?.lastname);
  const [showEmail, setShowEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [addressList, setAddressList] = useState({});
  const [email, setEmail] = useState(user?.email);
  const [gender, setGender] = useState(user?.gender);
  const [dob, setDob] = useState(
    user?.dateOfBirth ? user?.dateOfBirth.split('T')[0] : ''
  );

  const [phone, setPhone] = useState(user?.phone);
  const [avatar, setAvatar] = useState(user?.profileImage);
  const [error, setError] = useState(null);
  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  const setshowEmailChange = () => {
    setShowEmail(true);
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      setError('Please Enter the Fullname');
      return;
    }
    if (!phone.trim()) {
      setError('Please Enter the Phone NUmber');
      return;
    }
    if (!dob.trim()) {
      setError('Please select your Date of Birth');
      return;
    }
    const updatedData = {
      firstname: firstName,
      lastname: lastName,
      gender,
      dateOfBirth: dob,
      phone,
      avatar,
    };
    try {
      const response = await updateProfile(updatedData);
      toast.success('Profile updated!', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/412945-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAddress = async () => {
    try {
      const response = await getAddressApi();
      setAddressList(response.user.addresses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  const handleDelete = async () => {
    setIsOpen(false);
    try {
      await deleteAddress(selectedId);

      toast.success('Address deleted!', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/29520-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });
      getAddress();
    } catch (error) {
      console.log(error);
    }
  };

  const closeEmailModal = () => {
    setShowEmail(false);
  };
  const closePassChangeModal = () => {
    setShowChangePass(false);
  };
  const handleEmailUpdated = (updatedEmail) => {
    setEmail(updatedEmail);
  };

  const passChange = () => {
    setShowChangePass(true);
  };

  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-4 md:p-8 bg-white min-h-screen w-full rounded-xl"
    >
      <div>
        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-10"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <User className="md:w-6 md:h-6 w-4 h-4 text-black" />
            <h3 className="md:text-2xl font-bold text-black tracking-tight">
              Edit Details
            </h3>
          </div>
          <div className="space-y-4 md:space-y-6 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-100">
            <div className="flex content-between justify-between border-b border-gray-200 pb-4 items-center">
              <div>
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  First Name
                </p>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-2 md:p-3 text-xs rounded-md w-full lg:text-lg border-gray-300  md:text-lg border uppercase focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="ml-4">
                {avatar ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={avatar}
                    className="w-16 h-16 md:w-24 md:h-24  cursor-pointer rounded-full border-4 border-white shadow-md hover:brightness-90"
                    onClick={() => setShowModal(true)}
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowModal(true)}
                    className="w-16 h-16 md:w-24 md:h-24  cursor-pointer rounded-full border-4 border-white shadow-md hover:brightness-90"
                  >
                    <span className="text-gray-700">
                      <Camera />
                    </span>
                  </motion.div>
                )}
              </div>
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 max-w-sm w-full rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl text-center mb-4 font-semibold">
                      Select an Avatar
                    </h2>
                    <AvatarSelector handleAvatarSelect={handleAvatarSelect} />
                    <div className="flex justify-center mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="w-full">
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  Last Name
                </p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-2 md:p-3 text-xs rounded-md w-full border-gray-300 md:text-base lg:text-lg border uppercase focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex-grow">
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  Email Address
                </p>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className=" border-gray-300 p-2 text-sm md:text-base lg:text-lg rounded-md w-full bg-gray-100"
                  />
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={setshowEmailChange}
                className="text-gray-500 cursor-pointer text-sm md:text-base lg:text-lg hover:text-black ml-4 md:px-3 px-1 py-1 md:py-1 rounded-md border border-gray-300 hover:border-black"
              >
                change
              </motion.div>
            </div>

            <div className="flex space-x-6 items-center border-b border-gray-200 pb-4">
              <p className="text-gray-500 text-xs md:text-base">Gender:</p>
              <div className="flex gap-1 md:gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-0.5"
                  />
                  <label
                    htmlFor="male"
                    className="text-sm md:text-base  cursor-pointer"
                  >
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    checked={gender === 'Female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="female"
                    className="cursor-pointer text-sm md:text-base "
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="w-full">
                <p className="text-gray-500 text-xs md:text-sm   mb-1">
                  Date of Birth
                </p>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="md:text-lg text-base border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="w-full">
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  Phone Number
                </p>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="md:text-lg text-base border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  Password
                </p>
                <p className="font-medium text-lg">•••••••</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={passChange}
                className="text-gray-500 text-xs md:text-base cursor-pointer hover:text-black px-3 py-1 rounded-md border border-gray-300 hover:border-black"
              >
                change
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h3 className="text-base md:text-lg font-semibold">Address</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setSelectedTab('address'))}
              className="flex items-center md:px-4 px-2 py-1 text-sm md:text-base md:py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              Add New
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(addressList) &&
              addressList.length > 0 &&
              addressList.map((address, indx) => (
                <motion.div
                  key={address?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + indx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6 bg-gray-50 h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-base md:text-lg">
                        {address?.fullName}
                      </h4>
                      {indx === 0 && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <Phone className="w-4 h-4 text-gray-500 mt-1" />
                      <p className="text-gray-700 text-base">
                        {address?.phone}
                      </p>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <Home className="w-4 h-4 text-gray-500 mt-1" />
                      <p className="text-gray-700 text-sm md:text-base">
                        {address?.street}, {address?.city}, {address?.state},{' '}
                        {address?.country}, {address?.zipCode}
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                        {address?.addressType}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          dispatch(setSelectedTab('editaddress'));
                          setAddress(address);
                        }}
                        className=" border border-gray-300 rounded-md text-xs md:text-sm md:px-3 px-1 py-1 md:py-1 hover:border-blue-600 hover:text-blue-600 transition-colors duration-300"
                      >
                        EDIT
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedId(address._id);
                          setIsOpen(true);
                        }}
                        className="text-xs md:text-sm md:px-3 px-1 py-1 md:py-1 border border-gray-300 rounded-md  hover:border-red-500 hover:text-red-500 transition-colors duration-300"
                      >
                        DELETE
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          <div className="relative mt-9 flex items-center justify-center">
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-center text-red-500"
              >
                {error}
              </motion.p>
            )}
            <div className="absolute right-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 md:px-4 px-2 py-1 text-sm md:text-base md:py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
              >
                Save <Save size={15} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {showEmail && (
        <EmailChangeModal
          closeEmailModal={closeEmailModal}
          onEmailUpdated={handleEmailUpdated}
        />
      )}

      {showChangePass && (
        <ChangePassModal closePassChangeModal={closePassChangeModal} />
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
            >
              <div className="p-5 border-b">
                <div className="flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Remove Address
                  </h3>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-gray-600">
                  Are you sure you want to remove this address?
                </p>
              </div>
              <div className="flex border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 p-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 p-3 text-white bg-black font-medium hover:bg-gray-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditInfo;
export function AvatarSelector({ handleAvatarSelect }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    handleAvatarSelect(avatar.src);
  };

  const avatars = [
    { id: 1, src: '/images/Avatar/avatar4.png' },
    { id: 2, src: '/images/Avatar/avatar2.png' },
    { id: 3, src: '/images/Avatar/avatar3.png' },
    { id: 4, src: '/images/Avatar/avatar1.png' },
    { id: 5, src: '/images/Avatar/avatar5.png' },
    { id: 6, src: '/images/Avatar/avatar6.png' },
    { id: 7, src: '/images/Avatar/avatar7.png' },
    { id: 8, src: '/images/Avatar/avatar8.png' },
    { id: 9, src: '/images/Avatar/avatar9.png' },
    { id: 10, src: '/images/Avatar/avatar10.png' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          onClick={() => {
            handleSelect(avatar);
          }}
          className={`p-2 border  cursor-pointer transition-colors ${
            selectedAvatar === avatar.id ? 'border-black' : 'border-gray-300'
          }`}
        >
          <img
            src={avatar.src}
            alt={`Avatar ${avatar.id}`}
            className="w-full h-auto object-cover"
          />
        </div>
      ))}
    </div>
  );
}

const EmailChangeModal = ({ closeEmailModal, onEmailUpdated }) => {
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: null, type: null });
  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    let intervalId;
    if (otpSent) {
      setSecondsLeft(300); // 5 * 60 seconds
      intervalId = setInterval(() => {
        setSecondsLeft((sec) => {
          if (sec <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendOTP = async () => {
    if (!newEmail.trim()) {
      console.log('email', newEmail);
      setMessage({ message: 'Please provide an email', type: null });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setMessage({ message: 'Please provide a valid email', type: null });
      return;
    }

    try {
      setLoading(true);
      setOtpSent(false);
      await requestEmailChange(newEmail);
      setOtpSent(true);
      setLoading(false);
      setMessage({
        message: 'OTP sent to your new email address',
        type: 'success',
      });
    } catch (error) {
      setLoading(false);
      setMessage({ message: error.message, type: null });
      console.error(error);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.trim() === '') {
      setMessage({ message: 'Please enter the OTP', type: null });
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmailOTP(newEmail, otp);
      setLoading(false);

      if (response) {
        onEmailUpdated(newEmail);

        toast.success(response.message, {
          icon: (
            <img
              src="https://static.thenounproject.com/png/247537-200.png"
              className="animate-spin"
              style={{ filter: 'invert(1)' }}
              alt="Success Icon"
              width="30"
              height="30"
            />
          ),
          style: {
            border: '1px solid #0f5132',
            padding: '16px',
            color: 'white',
            background: 'black',
            fontSize: '14px',
            fontWeight: 'bold',
          },
          autoClose: 5000,
        });
        closeEmailModal();
      }
    } catch (error) {
      setLoading(false);
      setMessage({
        message:
          error.response?.data?.message ||
          'An error occurred. Please try again.',
        type: null,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white md:p-8 p-3 shadow-lg md:w-full md:max-w-md rounded-xl"
      >
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <Mail className="w-6 h-6 text-black" />
          <h2 className="md:text-xl font-bold text-black tracking-tight">
            Change Email
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p
            className={`text-center text-sm pb-3 ${
              message.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message.message}
          </p>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
            {!otpSent ? (
              <>
                <div>
                  <p className="text-gray-500 text-xs md:text-sm mb-2">
                    New Email Address
                  </p>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-500 text-xs md:text-sm mb-2">
                    Verification Code
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="flex justify-end mt-1">
                    <p className="text-xs text-gray-500">
                      {secondsLeft > 0 ? (
                        <>Resend in {formatTimer(secondsLeft)}</>
                      ) : (
                        <span
                          onClick={handleSendOTP}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Resend OTP
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-md border border-black bg-black text-white hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={closeEmailModal}
            disabled={loading}
            className="px-8 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const ChangePassModal = ({ closePassChangeModal }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill all the fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    if (newPassword === oldPassword) {
      setError("New password can't be the same as the old password");
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be atleast 6 characters');
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(oldPassword, newPassword);
      toast.success('Password Changed', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/247537-200.png"
            className="animate-spin"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        autoClose: 5000,
      });
      closePassChangeModal();
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-3 md:p-8 shadow-lg w-full max-w-md rounded-xl"
      >
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <Lock className="w-6 h-6 text-black" />
          <h2 className="md:text-xl text-lg font-bold text-black tracking-tight">
            Change Password
          </h2>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center text-xs md:text-sm mb-4 bg-red-50 p-3 rounded-md"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6"
        >
          {/* Old Password Input */}
          <div className="relative">
            <p className="text-gray-500 text-xs md:text-sm mb-2">
              Old Password
            </p>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-xs md:text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <p className="text-gray-500 text-xs md:text-sm mb-2">
              New Password
            </p>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-xs md:text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <p className="text-gray-500 text-xs md:text-sm mb-2">
              Confirm Password
            </p>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-xs md:text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md text-sm md:text-base hover:bg-white hover:text-black border border-black transition-colors duration-300"
          >
            {loading ? 'Please Wait' : 'Change Password'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={closePassChangeModal}
            disabled={loading}
            className="border border-gray-300 px-6 text-sm md:text-base py-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
