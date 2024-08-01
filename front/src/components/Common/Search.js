import React from "react";
import "../assets/Search.css";

export default function () {
  return (
    <div>
      <form action="">
        <input class="search-field" type="search" placeholder="Type a city.." />
        <input class="search-button" type="submit" value="Search" />
      </form>
    </div>
  );
}
