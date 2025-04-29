import React from 'react';

const Banner = () => {
  const firstRowItems = [
    // {
    //   heading: "Bridal",
    //   offerText: "",
    //   description: "Elegant Wedding Collection",
    //   imgSrc: "/images/Home/featured-1.webp",
    //   textcolor: "black",
    // },
    // {
    //   heading: "Knitwear's",
    //   offerText: "Essential wardrobe staples",
    //   description: "",
    //   imgSrc: "/images/Home/featured-5.jpg",
    //   textcolor: "black",
    // },
    // {
    //   heading: "L'Étoile",
    //   offerText: "",
    //   description: "fw 24",
    //   imgSrc: "/images/Home/featured-3.webp",
    //   textcolor: "white",
    // },
  ];

  const secondRowItems = [
    // {
    //   heading: "Topman X Hartley",
    //   offerText: "",
    //   description: "Classic tailoring meets streetwear",
    //   textcolor: "white",
    //   imgSrc: "/images/Home/featured-4.webp",
    // },
    {
      heading: 'Essential wardrobe staples',
      offerText: '',
      description: '',
      textcolor: 'white',
      imgSrc: '/images/Home/banner-2.avif',
    },
    // {
    //   heading: "Oversized T-Shirts",
    //   offerText: "",
    //   description: "Street Style Icon",
    //   imgSrc: "/images/Home/featured-2.jpg",
    //   textcolor: "black",
    // },
  ];

  return (
    <div className="container w-full mx-auto">
      {/* Second row */}
      <div className="">
        {secondRowItems.map((item, index) => (
          <div
            key={index}
            className="group w-full flex justify-center relative"
          >
            {/* Fixed-height container so images appear uniform */}
            <div className="w-full h-full">
              <img
                src={item.imgSrc}
                alt={item.heading}
                className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-95"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 sm:p-4">
              <h2
                className="text-xl md:text-5xl font-bold"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: item.textcolor,
                }}
              >
                {item.heading}
              </h2>
              <p
                className="mt-1 sm:mt-2 text-sm sm:text-base"
                style={{ color: item.textcolor }}
              >
                {item.description}
              </p>
              <p
                className="mt-1 sm:mt-2 font-bold text-sm sm:text-base"
                style={{ color: item.textcolor }}
              >
                {item.offerText}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* First row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {firstRowItems.map((item, index) => (
          <div
            key={index}
            className="group rounded-lg p-3 sm:p-4 w-full md:w-[400px] h-[500px] sm:h-[600px] relative"
          >
            <img
              src={item.imgSrc}
              alt={item.heading}
              className="rounded-lg w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 sm:p-4">
              <h2
                className="text-xl md:5xl sm:text-3xl font-bold"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: item.textcolor,
                }}
              >
                {item.heading}
              </h2>
              <p
                className="text-sm sm:text-lg"
                style={{ color: item.textcolor }}
              >
                {item.description}
              </p>
              <p
                className="mt-1 sm:mt-2 font-bold text-sm sm:text-base"
                style={{ color: item.textcolor }}
              >
                {item.offerText}
              </p>
              <button
                className="mt-3 sm:mt-4 cursor-pointer px-3 sm:px-4 py-1 sm:py-2 border rounded-full hover:bg-gray-500/20"
                style={{
                  color: item.textcolor,
                  borderColor: item.textcolor,
                }}
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

export default Banner;
