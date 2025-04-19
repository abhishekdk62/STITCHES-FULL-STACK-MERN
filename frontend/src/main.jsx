import { createRoot } from "react-dom/client";
import React from 'react'
import { Provider } from "react-redux";  // Import Provider from Redux
import store from "../store/store.js";  // Import the Redux store
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>  {/* Wrap App with Provider */}
    <Router>
    <Toaster
            toastOptions={{
              duration: 2400, 
            }}
    
    />

    <App />
    </Router>

  </Provider>
);
