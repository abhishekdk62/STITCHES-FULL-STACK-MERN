import React from "react";

const Promotions = () => {
  return (
    <div className="">
      <section className="container mx-auto px-4 py-8">
        <div className="flex md:flex-row gap-3 md:gap-0 flex-col space-x-4">
          <div className="md:w-1/2 w-full bg-yellow-400 text-white p-8 rounded-lg bg-[url('/images/Home/denim.jpg')] bg-cover bg-center">
            <h3 className="md:text-sm">Premium Denim</h3>
            <h2 className="md:text-2xl font-bold">Ultimate Comfort & Style</h2>
            <p className="mt-2">UP TO 50% OFF on Jeans & Pants</p>
            <button className="mt-4 bg-white/80 cursor-pointer text-black px-2 py-1 md:px-4 md:py-2 rounded-full hover:bg-white/40">
              Shop Now
            </button>
          </div>

          <div className="md:w-1/2 w-full text-white p-8 rounded-lg bg-[url('/images/Home/promo-2.jpg')] bg-cover bg-center">
            <h3 className="md:text-sm">Elegant Weddings</h3>
            <h2 className="md:text-2xl font-bold">Timeless Bridal Collection</h2>
            <p className="mt-2">Grace & Glamour for Your Big Day</p>
            <button className="mt-4 bg-white/80 cursor-pointer text-black px-2 py-1 md:px-4 md:py-2 rounded-full hover:bg-white/40">
              Explore Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Promotions;
