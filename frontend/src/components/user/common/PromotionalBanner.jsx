"use client"

import { useState, useEffect, useRef, use } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const defaultMessages = [
  { id: 1, text: "4 Days Return Policy", bgColor: "bg-[oklch(20.5% 0 0)]" },
  { id: 2, text: "Free Shipping on Orders Over ₹1000", bgColor: "bg-[#171717]" },
  { id: 3, text: "New Collections Available Now", bgColor: "bg-[#171717]" },
  { id: 4, text: "Refer a friend & Get 50% Off", bgColor: "bg-[#171717]" },
]

export default function PromotionalBanner({ 
  messages = defaultMessages,
  autoSlideInterval = 5000,
  className = "",
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const bannerRef = useRef(null)
  const[showBanner,setShowBanner]=useState(() => {
    const saved = localStorage.getItem("showBanner");
    return saved !== null ? JSON.parse(saved) : true;
  })
useEffect(()=>{
  localStorage.setItem("showBanner", JSON.stringify(showBanner));
},[showBanner])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? messages.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    if (isDismissed) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [autoSlideInterval, isDismissed])


  if (isDismissed) return null

  if(!showBanner)
  {
    return null
  }

  return (
    <div
      ref={bannerRef}
      className={`relative transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? "h-10" : "h-0"} ${className}`}
    >
      <div
        className={`flex items-center justify-center bg-[#1c1c1c] text-white text-sm font-medium h-10 relative`}
      >
        <button
          onClick={prevSlide}
          className=" left-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Previous promotion"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-center px-12">{messages[currentIndex].text}</p>

        <button
          onClick={nextSlide}
          className=" right-10 text-gray-500 hover:text-white transition-colors"
          aria-label="Next promotion"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

      <button onClick={()=>setShowBanner(false)}>X</button>
      </div>
    </div>
  )
}
