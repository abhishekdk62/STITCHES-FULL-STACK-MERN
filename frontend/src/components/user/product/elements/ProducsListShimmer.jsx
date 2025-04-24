import React from 'react'

const ProducsListShimmer = () => {
    return (
      <div className="relative">
        <div className="p-0 group cursor-pointer">
          <div className="flex items-center justify-center">
            <div className="w-100 h-100 relative">
              <div className="absolute ml-63 mt-2">
                <div className="bg-gray-300 h-5 w-10 rounded animate-pulse"></div>
              </div>
              
              <div className="w-full h-100 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0">
                  <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                       style={{
                         backgroundSize: '200% 100%',
                         animation: 'shimmerAnimation 1.5s infinite linear'
                       }}>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col mt-2 items-center">
          <div 
            style={{
              fontFamily: "'Cambay', sans-serif",
              fontWeight: 400,
            }}
            className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"
          ></div>
          
          {/* Price shimmer */}
          <div className="flex items-center justify-center space-x-2 mt-0">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes shimmerAnimation {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  };
  
  

export default ProducsListShimmer