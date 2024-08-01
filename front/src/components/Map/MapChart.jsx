import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import MapModal from './MapModal';

// 라이브러리 추가: npm install highcharts highcharts-react-official @types/highcharts proj4

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

        const data = [
          ['kr-4194', 10], ['kr-kg', 11], ['kr-cb', 12], ['kr-kn', 13],
          ['kr-2685', 14], ['kr-pu', 15], ['kr-2688', 16], ['kr-sj', 17],
          ['kr-tj', 18], ['kr-ul', 19], ['kr-in', 20], ['kr-kw', 21],
          ['kr-gn', 22], ['kr-cj', 23], ['kr-gb', 24], ['kr-so', 25],
          ['kr-tg', 26], ['kr-kj', 27]
        ]; 

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
          
          //이곳에 박스안의 내용 표시
          series: [{ 
            data: data,
            name: '지역별 날씨 정보',
            showInLegend: false,  // 레전드에서 이 시리즈를 숨깁니다
            states: {
              hover: {
                color: '#BADA55'
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
        console.error("Error loading topology:", error);
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
        <h2>{selectedRegion}</h2>
        <p>지역별 추가 정보 표시</p>
      </MapModal>
    </div>
  );
};

export default MapChart;