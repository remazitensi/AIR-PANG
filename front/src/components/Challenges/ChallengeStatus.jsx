import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import '../../styles/ChallengeStatus.css';

const ChallengeStatus = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('challenges')) {
      localStorage.setItem("challenges", JSON.stringify([{
        "id": 1,
        "challenge_id": 1,
        "title": "친환경 생활 실천",
        "description": "일주일 동안 플라스틱 사용 줄이기",
        "start_date": "2024-07-01",
        "end_date": "2024-08-01",
        "tasks": [
          {
            "description": "분리수거 하기",
            "is_completed": true
          },
          {
            "description": "포장하기",
            "is_completed": false
          }
        ]
      }, {
        "id": 2,
        "challenge_id": 2,
        "title": "대중교통 이용",
        "description": "자가 대신 대중교통 이용하기",
        "start_date": "2024-08-01",
        "end_date": "2024-09-01",
        "tasks": [
          {
            "description": "버스 타기",
            "is_completed": true
          },
          {
            "description": "지하철 타기",
            "is_completed": false
          },
          {
            "description": "자전거 타기",
            "is_completed": false
          }
        ]
      }]));
    }
    fetchChallenges();
  }, []);

  // //Axios 사용
  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/my`, {
        withCredentials: true // credentials 설정
      });
      console.log(response.data);
      setChallenges(response.data.Challeng_Status);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
   };

  //로컬스토리지 사용
  // const fetchChallenges = async () => {
  //   try {
  //     // 로컬 스토리지에서 데이터 가져오기
  //     const cachedData = JSON.parse(localStorage.getItem('challenges'));
  //     setChallenges(cachedData);
  //   } catch (error) {
  //     console.error('Error fetching challenges:', error);
  //   }
  // };

  function calculateDaysLeft(start_date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const timeDiff = startDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  const handleTaskCompletionToggle = (challengeId, taskIndex) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedTasks = challenge.tasks.map((task, index) => {
          if (index === taskIndex) {
            return { ...task, is_completed: !task.is_completed };
          }
          return task;
        });
        return { ...challenge, tasks: updatedTasks };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);
    localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
  };

  return (
    <div className='ChallengeStatus'>
      <h1>나의 챌린지 현황</h1>
      <div className='StatusLists'>
        {challenges.map(challenge => {
          const count = challenge.tasks.length;
          const completedCount = challenge.tasks.filter(task => task.is_completed).length;

          return (
            <div className='StatusList' key={challenge.id}>
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
              <ProgressBar
                completed={completedCount}
                maxCompleted={count}
                customLabel={`${Math.round(completedCount/count*100)}%`}
                width="148px"
                height='16px'
                baseBgColor='#EDEDED'
                bgColor='linear-gradient(to right, #CDEDFF, #00A3FF)'
                labelSize="10px"
              />
              <ul>
                {challenge.tasks.map((task, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => handleTaskCompletionToggle(challenge.id, index)}
                      /> {task.description}
                    </label>
                  </li>
                ))}
              </ul>
              <Link className="link" to={`/challenges/${challenge.id}`}>
                챌린지 페이지 보러가기
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default ChallengeStatus;
