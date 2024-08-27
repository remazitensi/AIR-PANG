// Cursor.js
import React, { useEffect } from "react";
import "../styles/Cursor.css"; // Import CSS specific to the cursor

const Cursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);

    const handleMouseMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.removeChild(cursor);
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default Cursor;
