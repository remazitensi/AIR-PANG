import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChallengeCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalTasks, setModalTasks] = useState(['', '', '', '', '']);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTaskChange = (index, value) => {
    const newTasks = [...modalTasks];
    newTasks[index] = value;
    setModalTasks(newTasks);
  };

  const handleSaveTasks = () => {
    setTasks(modalTasks.filter(task => task.trim() !== ''));
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalTasks(tasks.length > 0 ? tasks.concat(Array(5 - tasks.length).fill('')) : ['', '', '', '', '']);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      alert('종료일은 시작일보다 이전 날짜일 수 없습니다.');
      return;
    }

    const filteredTasks = tasks.filter(task => task.trim() !== '');

    if (filteredTasks.length <= 1) {
      alert('최소 2개의 할 일을 추가해야 합니다.');
      return;
    }

    const newChallenge = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      tasks: filteredTasks.map(task => ({ description: task, is_completed: false })),
    };

    //로컬스토리지 전용 newChallenge
    const storedChallenges = JSON.parse(localStorage.getItem('challenges')) || [];
    const maxId = storedChallenges.length > 0 ? Math.max(...storedChallenges.map(challenge => challenge.id)) : 0;
    const newId = maxId + 1;
    const newChallengeWithId = {...newChallenge, id: newId};

    //원본
    //try {
    //  const response = await fetch('http://localhost:8080/challenges', {
    //    method: 'POST',
    //    headers: {
    //      'Content-Type': 'application/json',
    //    },
    //    body: JSON.stringify(newChallenge),
    //  });
    //
    //  if (response.ok) {
    //    navigate('/challenges');
    //  } else {
    //    console.error('Error creating challenge');
    //  }
    //} catch (error) {
    //  console.error('Error creating challenge:', error);
    //}

    //Axios 사용
    //try {
    //  const response = await axios.post('http://localhost:8080/challenges', newChallenge, {
    //    headers: {
    //      'Content-Type': 'application/json',
    //    },
    //  });
    //
    //  if (response.status === 200 || response.status === 201) {
    //    navigate('/challenges');
    //  } else {
    //    console.error('Error creating challenge');
    //  }
    //} catch (error) {
    //  console.error('Error creating challenge:', error);
    //}

    //로컬스토리지 사용
    try {
      // 기존 데이터 가져오기
      const storedChallenges = JSON.parse(localStorage.getItem('challenges')) || [];
      // 새로운 데이터 추가
      storedChallenges.push(newChallengeWithId);
      // 업데이트된 데이터를 로컬스토리지에 저장
      localStorage.setItem('challenges', JSON.stringify(storedChallenges));
  
      // 챌린지 페이지로 이동
      navigate('/challenges');
      
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
    
  };

  const handleCancel = () => {
    navigate('/challenges');
  };

  return (
    <div>
      <h1>챌린지 생성하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>설명</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>시작일</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <label>종료일</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <p>*최소 2개의 할 일을 만들어 주세요.</p>
        <div>
          <label></label>
          <button type="button" onClick={handleOpenModal}>할 일 만들기</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={handleCancel}>취소하기</button>
        <button type="submit">만들기</button>
      </form>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>할 일 만들기</h2>
            <p>할 일은 최대 5개까지 생성 가능합니다.</p>
            {modalTasks.map((task, index) => (
              <input
                key={index}
                type="text"
                value={task}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                placeholder={`할 일 ${index + 1}`}
              />
            ))}
            <button onClick={handleSaveTasks}>저장하기</button>
            <button onClick={() => setModalOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeCreate;
