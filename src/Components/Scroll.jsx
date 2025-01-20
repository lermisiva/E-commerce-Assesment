import React from "react";

// Scroll function to handle smooth scroll to top
const handleScrollToTop = (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  window.scrollTo({
    top: 0, 
    behavior: 'smooth',
  });
};

export function Scroll() {
  return (
    <div className="static">
      <a
        href="#"
        onClick={handleScrollToTop} // Trigger scroll function on click
        className="fixed bottom-4 right-4 bg-blue-500 text-white  rounded-full shadow-lg px-4 py-2 hover:bg-blue-600 transform duration-150 ease-in-out"
      >
        ↑ {/* Arrow icon */}
      </a>
    </div>
  );
}
