import React, { useEffect } from "react";

function Geolocation({ onLocationFound }) {
  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      onLocationFound({ lat: latitude, lon: longitude });
    };

    const handleError = (error) => {
      console.error("Error getting location:", error);
      alert("Unable to retrieve your location.");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [onLocationFound]);

  return <div>Loading location...</div>;
}

export default Geolocation;
