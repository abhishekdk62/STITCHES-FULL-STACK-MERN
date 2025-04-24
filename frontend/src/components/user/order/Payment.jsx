import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createOrder } from "../../../services/orderServices";
import { createPaypalOrder } from "../../../services/paypalService";
import PayPalButton from "../../../../utils/PaypalButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, CreditCard, Truck, CheckCircle, AlertCircle, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

const PaymentSuccessComponent = () => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-green-50 p-6 mb-6 rounded-lg border border-green-200 text-center"
  >
    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
    <h2 className="text-green-700 font-bold text-lg">Payment Successful</h2>
    <p className="text-green-600">Your payment has been processed successfully.</p>
  </motion.div>
);

const PaymentErrorComponent = ({ error }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-50 p-6 mb-6 rounded-lg border border-red-200 text-center"
  >
    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
    <h2 className="text-red-700 font-bold text-lg">Payment Error</h2>
    <p className="text-red-600">{error}</p>
  </motion.div>
);

export default function Payment({ setStep,couponData }) {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const address = useSelector((state) => state.checkout.shippingAddress);
  const cartItems = useSelector((state) => state.checkout.cart);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const userDetails = useSelector((state) => state.auth.user);
const [disableCod,setDisableCod]=useState(false)



  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };
  const discount = ((couponData?.discountValue)/100*(cartItems?.totalPrice + cartItems?.tax)) || 0;

  const grandTotal =
    cartItems?.totalPrice + cartItems?.tax + cartItems?.shippingPrice-discount;

    useEffect(()=>{
      if(paymentMethod=="cod" && grandTotal>=1000)
        {
          setDisableCod(true)
        
        }
    
    },[paymentMethod,grandTotal])
    


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if(disableCod)
    {
      return setErrorMessage("Cash on delivery cant be applied for products with price more than 1000")
    }
    try {
      const response = await createOrder(
        cartItems._id,
        cartItems.items,
        address,
        paymentMethod,
        cartItems.totalPrice,
        cartItems.tax,
        cartItems.shippingPrice,
        grandTotal,
        discount,
        couponData||{}
      );
      setSuccessMessage("Order placed successfully!");

      navigate("/order/confirmed");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "There was an error processing your order. Please try again."
      );
    }
  };

  const handleWalletPayment = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await createOrder(
        cartItems._id,
        cartItems.items,
        address,
        paymentMethod,
        cartItems.totalPrice,
        cartItems.tax,
        cartItems.shippingPrice,
        grandTotal,
        discount,
        couponData||{}
      );
      setSuccessMessage("Order placed successfully!");

      navigate("/order/confirmed");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "There was an error processing your order. Please try again."
      );
    }
  };

  const paymentOptions = [
    {
      id: "wallet",
      name: "Wallet",
      icon: <Wallet className="w-5 h-5" />,
      description: "Pay using your account balance"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Safe online payment"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Truck className="w-5 h-5" />,
      description: "Pay when you receive your order"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-white  w-full mx-auto"
    >
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-bold text-black tracking-tight">Payment</h2>
        </div>
  
      </div>

      {successMessage && <PaymentSuccessComponent />}
      {errorMessage && <PaymentErrorComponent error={errorMessage} />}

      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentOptions.map((option) => (
              <motion.label 
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col p-5 border rounded-lg cursor-pointer transition-all duration-200 ${
                  paymentMethod === option.id 
                    ? "border-black bg-gray-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span className="font-medium">{option.name}</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="h-4 w-4 accent-black"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {paymentMethod === "wallet" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-md font-semibold mb-1">Your Balance</h3>
                <p className="text-gray-500 text-md">Current wallet balance</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{userDetails?.balance.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <h3 className="text-md font-medium mb-1">Amount to Pay</h3>
                <p className="text-gray-500 text-sm">Total order amount</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{grandTotal?.toFixed(2)}</p>
              </div>
            </div>
            
            {userDetails?.balance < grandTotal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-amber-50 rounded border border-amber-200 text-amber-800"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">Insufficient balance</p>
                </div>
                <p className="text-sm mt-1 pl-7">Please select another payment method.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {paymentMethod === "paypal" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100 text-center"
          >
            <div className="mb-4">
              <div className="w-15 h-15 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <h3 className="text-md font-semibold mb-2">PayPal Checkout</h3>
            <p className="text-gray-600 text-md mb-4">You will be redirected to PayPal to complete your payment securely.</p>
            <p className="font-bold  text-md mb-1">Total: ₹{grandTotal?.toFixed(2)}</p>
          </motion.div>
        )}

        {paymentMethod === "cod" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Truck className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cash on Delivery</h3>
                <p className="text-gray-600 text-sm mb-4">Pay with cash when your order is delivered to your doorstep.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">No advance payment required</span>
                  </li>
                  <li className="flex items-center text-sm gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Inspect your items before paying</span>
                  </li>
                </ul>
            <p className="font-bold pt-3  text-md mb-1">Total: ₹{grandTotal?.toFixed(2)}</p>

              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(2)}
            className="px-6 py-3 flex items-center gap-2 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Summary
          </motion.button>

          {paymentMethod === "paypal" ? (
            <PayPalButton grandTotal={grandTotal} paymentMethod={paymentMethod} />
          ) : paymentMethod === "wallet" ? (
            <motion.button
              whileHover={{ scale: userDetails?.balance >= grandTotal ? 1.02 : 1 }}
              whileTap={{ scale: userDetails?.balance >= grandTotal ? 0.98 : 1 }}
              disabled={userDetails?.balance < grandTotal}
              type="button"
              onClick={handleWalletPayment}
              className={`px-8 py-3 flex items-center gap-2 rounded ${
                userDetails?.balance < grandTotal
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300"
              }`}
            >
              Pay and Place Order
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`px-8 py-3 flex items-center gap-2 bg-black ${disableCod?"cursor-not-allowed":null} text-white border border-black hover:bg-white hover:text-black transition-all duration-300 rounded`}
            >
              Place Order
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </form>
    </motion.div>
  );
}