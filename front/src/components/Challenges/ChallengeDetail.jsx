import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios';
import '../../styles/ChallengeDetail.css';
const apiUrl = process.env.REACT_APP_API_URL;

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`${apiUrl}/challenges/${id}`, {
          withCredentials: true // credentials 설정
        });
        const data = response.data;
        setChallenge(data.challenge);
        setTasks(data.tasks);
        setCurrentUser(data.user);
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('챌린지를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/challenges/${id}`, {
          withCredentials: true
        });

        if (response.status === 204) {
          navigate('/challenges');
        } else {
          console.error('Error deleting challenge');
        }
      } catch (error) {
        console.error('Error deleting challenge:', error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/challenges/edit/${id}`);
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

  if (!challenge) {
    return <p>Loading...</p>;
  }

  let count = tasks.length;
  let completedCount = tasks.filter(task => task.is_completed).length;
  let label = Math.round(completedCount/count*100);

  if (completedCount === 0) {
    completedCount = 1;
    count = 18;
    label = 0;
  }

  const isOwner = currentUser && challenge.user_id === currentUser.id;

  return (
    <div className='detail'>
      <h1>{challenge.title}</h1>
      <span>
        {calculateDaysLeft(challenge.start_date) >= 1
          ? <div>{calculateDaysLeft(challenge.start_date)}일 후 시작</div>
          : (calculateDaysLeft(challenge.end_date) < 0
            ? <div>종료</div>
            : <div>진행중</div>
          )
        }
      </span>
      <p>{formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)}</p>
      <p className="desc">{challenge.description}</p>
      
      <ul className="to-dos">
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.is_completed}
              readOnly
            /> {task.description}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div>
          <button onClick={handleEdit}>수정하기</button>
          <button onClick={handleDelete}>삭제하기</button>
        </div>
      )}
      
      <div className="progress">
        <p>{challenge.user_name}님의 달성률</p>
        <ProgressBar
          completed={completedCount}
          maxCompleted={count}
          customLabel={`${label}%`}
          width="500px"
          height='16px'
          baseBgColor='#EDEDED'
          bgColor='linear-gradient(to right, #CDEDFF, #00A3FF)'
        />
      </div>
    </div>
  );
}

export default ChallengeDetail;
