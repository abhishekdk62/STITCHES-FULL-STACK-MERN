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
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
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
      className="p-8 bg-white min-h-screen w-4xl rounded-xl"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold">Edit Address</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Full Name</p>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Country</p>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.name.common} value={c.name.common}>
                    {c.name.common}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">State</p>
              <input
                placeholder="State"
                id="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Street</p>
              <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">City</p>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Phone Number</p>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Zip Code</p>
              <input
                type="text"
                placeholder="Zip Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-1">Address Type</p>
              <select
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
                className="text-lg border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </form>

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
          <div className="absolute right-0 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setSelectedTab("editinfo"))}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              Save <Save size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}