// import React, { useState, useEffect } from "react";

// const banners = [
//   {
//     id: 2,
//     image: "/images/Home/banner-2.avif",
//     alt: "BREEZY SUMMER",
//     textColor: "text-white",
//     title: "BREEZY SUMMER STYLE",
//     description: "Mens collection",
//     bg: "bg-black/40",
//     obj: "object-cover",
//     objectPosition: "center top", // Moves image to show more of the top
//     font: "'Cambay', sans-serif",
//     size: "text-5xl",
//   },
//   {
//     id: 1,
//     image: "/images/Home/banner-6.jpg",
//     alt: "Premium Suits",
//     textColor: "text-white",
//     title: "Premium Suits",
//     description: "Elegance Redefined",
//     bg: "bg-black/30",
//     obj: "object-contain",
//     font: "'EB Garamond', serif",
//     objectPosition: "center 10%", // Add this new key for inline styles
//     size: "text-7xl",
//   },
//   {
//     id: 4,
//     image:
//       "/images/Home/banner-lehanga.jpg",
//     alt: "Women Clothing Banner",
//     textColor: "text-white",
//     title: "",
//     description: "",
//     bg: "",
//     obj: "object-cover ",
//     objectPosition: "center 10%", // Add this new key for inline styles

//     font: "'EB Garamond', serif",
//     size: "text-5xl",
//   },

//   {
//     id: 3,
//     image: "/images/Home/banner-3.jpg",
//     alt: "Kids Wear Banner",
//     textColor: "text-white",
//     title: "Kids Wear",
//     description: "Trendy and comfortable kids wear",
//     bg: "bg-black/20",
//     objectPosition: "center 10%", // Add this new key for inline styles
//     obj: "object-cover ",
//     font: "'Cambay', sans-serif",
//     size: "text-5xl",
//   },
// ];

// const Banner = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const nextSlide = (direction) => {
//     if (isAnimating) return;
//     setIsAnimating(true);

//     setCurrentIndex((prev) => {
//       if (direction === "right") {
//         return prev === banners.length - 1 ? 0 : prev + 1;
//       } else {
//         return prev === 0 ? banners.length - 1 : prev - 1;
//       }
//     });

//     setTimeout(() => {
//       setIsAnimating(false);
//     }, 500); // Match this duration with the CSS transition duration
//   };

//   useEffect(() => {
//     const interval = setInterval(() => nextSlide("right"), 8000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative w-full h-120 overflow-hidden">
//       <div
//         className={`w-full h-full flex transition-transform duration-500 ease-in-out`}
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {banners.map((banner, index) => (
//   <div 
//     key={index}
//     className="group cursor-pointer w-full flex justify-center items-center flex-shrink-0 relative"
//     style={{
//       backgroundImage: `url(${banner.image})`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//     }}
//   >
//     <img
//       src={banner.image}
//       alt={banner.alt}
//       className={`w-full h-full ${banner.obj} transition duration-300 ease-in-out group-hover:brightness-75`}
//       style={{ objectPosition: banner.objectPosition }}
//     />

//     <div
//       className={`absolute inset-0 flex flex-col items-center justify-center ${banner.bg}`}
//     >
//       <p
//         style={{ fontFamily: `${banner.font}` }}
//         className={`${banner.size} font-bold ${banner.textColor}`}
//       >
//         {banner.title}
//       </p>
//       <p className={`text-sm ${banner.textColor}`}>
//         {banner.description}
//       </p>
//     </div>
//   </div>
// ))}

//       </div>

//       {/* Navigation Buttons */}
//       <button
//         onClick={() => nextSlide("left")}
//         className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
//       >
//         ❮
//       </button>
//       <button
//         onClick={() => nextSlide("right")}
//         className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
//       >
//         ❯
//       </button>

//       {/* Indicators */}
//       <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
//         {banners.map((_, index) => (
//           <div
//             key={index}
//             className={`w-2 h-2 rounded-full cursor-pointer ${
//               index === currentIndex ? "bg-white" : "bg-gray-400"
//             }`}
//             onClick={() => setCurrentIndex(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Banner;


import React from "react";

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
      heading: "Essential wardrobe staples",
      offerText: "",
      description: "",
      textcolor: "white",
      imgSrc: "/images/Home/banner-2.avif",
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
    <div className="container mx-auto">
    
  <div className="">
        {secondRowItems.map((item, index) => (
          <div
            key={index}
            className="group flex justify-center relative"
          >
            {/* Fixed-height container so images appear uniform */}
            <div className="w-full h-full">
              <img
                src={item.imgSrc}
                alt={item.heading}
                className=" w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-95"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h2
                className={`text-5xl font-bold text-${item.textcolor}`}
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                {item.heading}
              </h2>
              <p className={`mt-2 text-${item.textcolor}`}>
                {item.description}
              </p>
              <p className={`mt-2 font-bold text-${item.textcolor}`}>
                {item.offerText}
              </p>
              {/* <button
                className={`mt-4 cursor-pointer px-4 py-2 border text-${item.textcolor} border-gray-800 rounded-full hover:bg-gray-500/20`}
              >
                SHOP NOW
              </button> */}
            </div>
          </div>
        ))}
      </div>
      {/* First row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 justify-items-center">
        {firstRowItems.map((item, index) => (
          <div
            key={index}
            className="group  rounded-lg p-4 w-full md:w-[400px] h-[600px] relative"
          >
            <img
              src={item.imgSrc}
              alt={item.heading}
              className="rounded-lg w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h2
                className={`text-5xl font-bold text-${item.textcolor}`}
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                {item.heading}
              </h2>
              <p className={`text-lg text-${item.textcolor}`}>
                {item.description}
              </p>
              <p className={`mt-2 font-bold text-${item.textcolor}`}>
                {item.offerText}
              </p>
              <button
                className={`mt-4 cursor-pointer px-4 py-2 border text-${item.textcolor} border-white rounded-full hover:bg-gray-500/20`}
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
