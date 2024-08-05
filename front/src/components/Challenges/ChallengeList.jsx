import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ChallengeList.css';

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState('');

  const fetchChallenges = async (searchQuery = '') => {
   try {
     const response = await axios.get(`http://localhost:8080/challenges?search=${searchQuery}`, {
      withCredentials: true // credentials 설정
    });
     setChallenges(response.data.challenges);
   } catch (error) {
     console.error('Error fetching challenges:', error);
   }
  };
  
  useEffect(() => {
   fetchChallenges(); // 페이지 로드 시 모든 챌린지 불러오기
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChallenges(search); // 검색어에 맞는 챌린지 리스트 불러오기
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  function calculateDaysLeft(start_date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const timeDiff = startDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  return (
    <div className="ChallengeList">
      <h1>챌린지</h1>
      <form className="search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="챌린지를 검색해보세요."
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">찾기</button>
      </form>
      <button className="createChallenge">
        <Link to="/challenges/create">챌린지 만들기</Link>
      </button>
      <ul className="Challenges">
        {challenges.map(challenge => (
          <li key={challenge.id}>
            <Link to={`/challenges/${challenge.id}`}>
              <span>
                {
                  calculateDaysLeft(challenge.start_date) >= 1
                  ? <div>{calculateDaysLeft(challenge.start_date)}일 후 시작</div>
                  : ( calculateDaysLeft(challenge.end_date) < 0
                      ? <div>종료</div>
                      : <div>진행중</div>
                    )
                }
              </span>
              <h3>{challenge.title}</h3>
              <p>{formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChallengeList;
