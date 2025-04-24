import React, { useEffect, useState } from "react";
import { addAddress, editAddress } from "../../../services/userService";
import { getCountries } from "../../../services/countiesService";
import { useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import { MapPin, Save } from "lucide-react";
import { setSelectedTab } from "../../../../slices/selectedTabSlice";
export default function EditAddress({ address }) {
  const [fullName, setFullName] = useState(address?.fullName);
  const [country, setCountry] = useState(address?.country);
  const [street, setStreet] = useState(address?.street);
  const [city, setCity] = useState(address?.city);
  const [state, setState] = useState(address?.state);
  const [phone, setPhone] = useState(address?.phone);
  const [zip, setZip] = useState(address?.zipCode);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [addressType, setAddressType] = useState(address?.addressType);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        setCountries(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountries();
  }, []);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter the Fullname");
      return;
    }
    if (!country) {
      setError("Please select the Country");
      return;
    }
    if (!street) {
      setError("Please enter the Street");
      return;
    }
    if (!city) {
      setError("Please enter the City");
      return;
    }
    if (!state) {
      setError("Please enter the State");
      return;
    }
    if (!phone) {
      setError("Please enter the Phone Number");
      return;
    }
    if (!zip) {
      setError("Please enter the Zip Code");
      return;
    }

    try {
      const addressData = {
        fullName,
        country,
        street,
        city,
        state,
        phone,
        zipCode: zip,
        defaultBilling,
        addressType,
      };

      const response = await editAddress(addressData, address._id);
      toast.success("Address updated!", {
        icon: (
          <img 
            src="https://static.thenounproject.com/png/29520-200.png" 
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon" 
            width="30" 
            height="30" 
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      dispatch(setSelectedTab("editinfo"));
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Something went wrong", {
        icon: (
          <img 
            src="https://static.thenounproject.com/png/29520-200.png" 
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon" 
            width="30" 
            height="30" 
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "red",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-4xl p-8 bg-white rounded-xl"
    >
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-gray-700">
          Home
        </a>
        <span className="mx-2">{">"}</span>
        <a href="/account" className="hover:text-gray-700">
          My Account
        </a>
        <span className="mx-2">{">"}</span>
        <span className="text-gray-700">Edit Address</span>
      </nav>

      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-black" />
          <h2 className="text-xl font-bold text-black tracking-tight">Edit Address</h2>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
        >
          <p className="text-red-600 text-sm flex items-center">
            <X size={16} className="mr-2" />
            {error}
          </p>
        </motion.div>
      )}

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">State/Province</label>
              <input
                placeholder="Enter your state"
                id="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">ZIP/Postal Code</label>
              <input
                type="text"
                placeholder="Enter zip code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-500">Street Address</label>
              <input
                type="text"
                placeholder="Enter your street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Address Type</label>
              <select
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => dispatch(setSelectedTab("editinfo"))}
            className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-white hover:text-black border border-black transition-colors duration-300"
          >
            Save Address
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}