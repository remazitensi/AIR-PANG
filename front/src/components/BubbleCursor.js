// BubbleCursor.js
import React, { useEffect } from "react";
import "../styles/BubbleCursor.css";

const BubbleCursor = () => {
  useEffect(() => {
    const colours = ["#CDEDFF", "#E7F6FF", "#FFFFFF"];
    const bubbles = 10;
    const bubbleElements = [];

    const createBubble = () => {
      const bubble = document.createElement("div");
      const size = Math.random() * 15 + 10; // Random size between 5px and 20px
      bubble.style.position = "fixed";
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.backgroundColor =
        colours[Math.floor(Math.random() * colours.length)];
      bubble.style.borderRadius = "50%";
      bubble.style.opacity = 0.5;
      bubble.style.zIndex = 9999;
      bubble.style.pointerEvents = "none"; // Ensures bubble does not interfere with other elements
      document.body.appendChild(bubble);
      return bubble;
    };

    for (let i = 0; i < bubbles; i++) {
      bubbleElements.push(createBubble());
    }

    const updateBubbles = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      bubbleElements.forEach((bubble, index) => {
        setTimeout(() => {
          // Add space between bubbles by offsetting their positions
          bubble.style.left = `${x + index * 5}px`; // Adjust the multiplier for desired space
          bubble.style.top = `${y + index * 5}px`;
        }, index * 50); // Adjust the delay for slower movement
      });
    };

    document.addEventListener("mousemove", updateBubbles);

    return () => {
      document.removeEventListener("mousemove", updateBubbles);
      bubbleElements.forEach((bubble) => document.body.removeChild(bubble));
    };
  }, []);

  return null; // This component does not render anything directly
};

export default BubbleCursor;
