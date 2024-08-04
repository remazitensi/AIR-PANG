// src/DataFetcher.js
import React, { useEffect } from 'react';
import axios from 'axios';

function DataFetcher() {
  useEffect(() => {
    axios.get('http://localhost:8080/locations/detail')
      .then(response => {
        console.log('Fetch된 데이터:', response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Data Fetcher</h1>
      <p>콘솔을 확인해보세요</p>
    </div>
  );
}

export default DataFetcher;
