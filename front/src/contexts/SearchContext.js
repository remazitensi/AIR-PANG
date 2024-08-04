import React, { createContext, useState } from "react";

// Create the context
const SearchContext = createContext();

// Define the provider
const SearchProvider = ({ children }) => {
  const [searchData, setSearchData] = useState([]);

  return (
    <SearchContext.Provider value={{ searchData, setSearchData }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
