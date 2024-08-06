import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;
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
      height: 400
    }
  });

  const navigate = useNavigate();

  const handleRegionClick = (e) => {
    const regionName = e.point.name;
    const encodedRegionName = encodeURIComponent(regionName);
    navigate(`/locations/sub?location=${encodedRegionName}`);
  };

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const topology = await import('../../data/kr-all.topo.json');
        const response = await axios.get(`${apiUrl}/locations`);
        const locationsData = response.data;

        const data = locationsData.map((location) => {
          const mapKey = {
            '강원': 'kr-kw',  //보시는 바와 같이 여기서는 지도데이터랑 같이 동작하도록 매핑을 해주었습니다
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
            height: 650
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
    </div>
  );
};

export default MapChart;
