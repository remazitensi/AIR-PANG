// src/MapChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import MapModal from './MapModal';
import MonthlyAqi from '../Chart/MonthlyAqi';

// 라이브러리 추가: npm install highcharts highcharts-react-official @types/highcharts proj4 axios

// Highcharts 맵 모듈 초기화
if (typeof window !== 'undefined') {
  highchartsMap(Highcharts);
}

// proj4 설정 (좌표계를 활용한 맵 프로젝션에 필요)
if (typeof window !== 'undefined') {
  window.proj4 = proj4;
}

Highcharts.setOptions({
  credits: {
    enabled: false
  }
});

const MapChart = () => {
  const [mapOptions, setMapOptions] = useState({
    chart: {
      map: null,
      height: 600
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleRegionClick = (e) => {
    const regionName = e.point.name;
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        // 로컬 파일 import
        const topology = await import('../../data/kr-all.topo.json');

        // 데이터 가져오기
        const response = await axios.get('http://localhost:8080/locations');
        const locations = response.data;

        // 데이터 형식 변환
        const data = locations.map((location, index) => {
          const mapKey = {
            '강원': 'kr-kw',
            '경기': 'kr-kg',
            '경남': 'kr-kn',
            '경북': 'kr-2688',
            '광주': 'kr-kj',
            '대구': 'kr-tg',
            '대전': 'kr-tj',
            '부산': 'kr-pu',
            '서울': 'kr-so',
            '세종': 'kr-sj',
            '울산': 'kr-ul',
            '인천': 'kr-in',
            '전남': 'kr-2685',
            '전북': 'kr-cb',
            '제주': 'kr-cj',
            '충남': 'kr-gn',
            '충북': 'kr-gb'
          }[location.location];
          return [mapKey, location.averageAQI];
        });

        setMapOptions({
          chart: {
            map: topology.default,  // .default를 사용하여 실제 데이터에 접근
            height: 600
          },
          title: {
            text: undefined
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },
          colorAxis: {
            min: 0,
            max: 300,
            stops: [
              [0 / 300, '#3060cf'],  // 0-50: 좋음 (파랑)
              [50 / 300, '#66CDAA'], // 51-100: 보통 (연청록색)
              [100 / 300, '#ffff00'], // 101-150: 민감군영향 (노랑)
              [150 / 300, '#ff8000'], // 151-200: 나쁨 (주황)
              [200 / 300, '#ff0000'], // 201-300: 매우 나쁨 (빨강)
              [300 / 300, '#8B0000']  // 301 이상: 위험 (어두운 빨강)
            ]
          },
          series: [{ 
            data: data,
            name: '지역별 AQI',
            showInLegend: false,  // 레전드에서 이 시리즈를 숨깁니다
            states: {
              hover: {
                color: '#D1E5E1'

              }
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            },
            point: {
              events: {
                click: handleRegionClick
              }
            }
          }]
        });
      } catch (error) {
        console.error("Error loading topology or fetching data:", error);
      }
    };

    fetchTopology();
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={mapOptions}
        constructorType={'mapChart'}
      />
      <MapModal isOpen={isModalOpen} onClose={closeModal}>
        {/* <h2>{selectedRegion}</h2> */}
        <a href='http://localhost:3000/locations=${selectedRegion}'>{selectedRegion}</a> 
      </MapModal>
    </div>
  );
};

export default MapChart;
