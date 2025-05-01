import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
} from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is typically 768px
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSection = (section) => {
    if (isMobile) {
      setOpenSection(openSection === section ? null : section);
    }
  };

  const renderSectionContent = (section, content) => {
    if (!isMobile || openSection === section) {
      return content;
    }
    return null;
  };

  const renderSectionHeader = (section, title) => {
    return (
      <h4
        onClick={() => toggleSection(section)}
        className="font-semibold text-xs sm:text-sm uppercase mb-4 tracking-wider cursor-pointer flex justify-between items-center"
      >
        {title}
        {isMobile && (
          <span className="ml-2">
            {openSection === section ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        )}
      </h4>
    );
  };

  return (
    <footer className="bg-gray-200 w-full mt-10 mb-3 text-black py-12 border-t border-gray-200">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="mb-4 md:mb-0">
            <p className="text-xs  sm:text-sm flex items-center text-gray-600">
              <div className='hidden md:block'>
              <img
                className="lg:h-30 hidden md:block md:h-20 md:w-20 lg:w-30"
                src="https://static.thenounproject.com/png/626032-200.png"
                alt=""
              />
              <p className='text-xs text-center mt-3'>Stitches.co</p>
              </div>
            </p>
            <p className="text-[0.6rem] mt-2 text-gray-500">
            </p>
            <div className="md:flex hidden  space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-800 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          {/* Company Section */}
          <div>
            {renderSectionHeader('company', 'Company')}
            {renderSectionContent(
              'company',
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about-us"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Support Section */}
          <div>
            {renderSectionHeader('support', 'Support')}
            {renderSectionContent(
              'support',
              <ul className="space-y-2">
                <li>
                  <a
                    href="/faq"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/shipping"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Shipping Information
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Customer Care Section */}
          <div>
            {renderSectionHeader('customerCare', 'Customer Care')}
            {renderSectionContent(
              'customerCare',
              <ul className="space-y-2">
                <li>
                  <a
                    href="/track-order"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a
                    href="/returns-policy"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a
                    href="/size-charts"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Size Charts
                  </a>
                </li>
                <li>
                  <a
                    href="/costume-care"
                    className="text-xs sm:text-sm text-gray-600 hover:text-black"
                  >
                    Stitches Care
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className='text-xs text-gray-500'>
          © 2025 Stitches. All rights reserved.

          </div>
          <div className="flex items-center space-x-4">
            <p className="text-xs sm:text-sm text-gray-500 mr-2">
              Secure Payment:
            </p>
            <SiVisa size={28} className="text-blue-700" />
            <SiMastercard size={28} className="text-red-500" />
            <FaGooglePay size={32} className="text-gray-700" />
            <FaApplePay size={32} className="text-black" />
            <FaPaypal size={20} className="text-blue-800" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
