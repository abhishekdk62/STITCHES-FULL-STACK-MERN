import React from 'react';
import { useNavigate } from 'react-router-dom';

const Saving = () => {
  const firstRowItems = [
    {
      heading: 'Bridal',
      offerText: '',
      description: 'Elegant Wedding Collection',
      imgSrc: '/images/Home/featured-1.webp',
      textcolor: 'black',
    },
    {
      heading: "Knitwear's",
      offerText: 'Perfect fittings',
      description: '',
      imgSrc: '/images/Home/featured-5.jpg',
      textcolor: 'black',
    },
    {
      heading: "L'Étoile",
      offerText: '',
      description: 'fw 24',
      imgSrc: '/images/Home/featured-3.webp',
      textcolor: 'white',
    },
  ];

  const secondRowItems = [
    {
      heading: '',
      offerText: '',
      description: '',
      textcolor: 'black',
      imgSrc: '/images/Home/title2.webp',
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="">
      {/* Second row */}
      <div className="">
        {secondRowItems.map((item, index) => (
          <div
            key={index}
            className="group rounded-lg flex justify-center relative"
          >
            {/* Fixed-height container so images appear uniform */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-full">
              <img
                src={item.imgSrc}
                alt={item.heading}
                className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-95"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 sm:p-4">
              <h2
                className="text-2xl sm:text-3xl md:text-5xl font-bold"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: item.textcolor,
                }}
              >
                {item.heading}
              </h2>
              <p
                className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg"
                style={{ color: item.textcolor }}
              >
                {item.description}
              </p>
              <p
                className="mt-1 sm:mt-2 font-bold text-sm sm:text-base md:text-lg"
                style={{ color: item.textcolor }}
              >
                {item.offerText}
              </p>
              <button
                onClick={() => {
                  navigate('/products');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 0);
                }}
                className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-xl cursor-pointer px-2 sm:px-4 py-1 sm:py-2 border rounded-full hover:bg-gray-500/20"
                style={{ color: item.textcolor, borderColor: item.textcolor }}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* First row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {firstRowItems.map((item, index) => (
          <div
            key={index}
            className="group rounded-lg p-3 sm:p-4 w-full h-[400px] sm:h-[500px] md:h-[600px] relative"
          >
            <img
              src={item.imgSrc}
              alt={item.heading}
              className="rounded-lg w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 sm:p-4">
              <h2
                className="text-xl sm:text-2xl md:text-4xl font-bold"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: item.textcolor,
                }}
              >
                {item.heading}
              </h2>
              <p
                className="text-sm sm:text-base md:text-lg"
                style={{ color: item.textcolor }}
              >
                {item.description}
              </p>
              <button
                onClick={() => {
                  navigate('/products');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 0);
                }}
                className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-2 border rounded-full hover:bg-gray-500/20"
                style={{ color: item.textcolor, borderColor: item.textcolor }}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saving;
