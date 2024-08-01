import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ChallengeEdit.css';

function ChallengeEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalTasks, setModalTasks] = useState(['', '', '', '', '']);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  //원본
  //useEffect(() => {
  //  fetch(`http://localhost:8080/challenges/${id}`)
  //    .then(response => response.json())
  //    .then(data => {
  //      setTitle(data.challenge.title);
  //      setDescription(data.challenge.description);
  //      setStartDate(data.challenge.start_date.split('T')[0]);
  //      setEndDate(data.challenge.end_date.split('T')[0]);
  //      setTasks(data.tasks.map(task => task.description));
  //    })
  //    .catch(error => console.error('Error fetching challenge:', error));
  //}, [id]);

  //Axios 사용
  //useEffect(() => {
  //  const fetchChallenge = async () => {
  //    try {
  //      const response = await axios.get(`http://localhost:8080/challenges/${id}`);
  //      const data = response.data;
  //      setTitle(data.challenge.title);
  //      setDescription(data.challenge.description);
  //      setStartDate(data.challenge.start_date.split('T')[0]);
  //      setEndDate(data.challenge.end_date.split('T')[0]);
  //      setTasks(data.tasks.map(task => task.description));
  //    } catch (error) {
  //      console.error('Error fetching challenge:', error);
  //    }
  //  };
  //
  //  fetchChallenge();
  //}, [id]);

  //로컬스토리지 사용
  useEffect(()=> {
    const challenges = JSON.parse(localStorage.getItem('challenges'));
    const selectedChallenge = challenges.find(challenge => challenge.id === parseInt(id));
    
    if (selectedChallenge) {
      setTitle(selectedChallenge.title);
      setDescription(selectedChallenge.description);
      setStartDate(selectedChallenge.start_date);
      setEndDate(selectedChallenge.end_date);
      setTasks(selectedChallenge.tasks.map(task => task.description));
    }
  }, [id]);

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

    if (filteredTasks.length === 0) {
      alert('최소 1개의 할 일을 추가해야 합니다.');
      return;
    }

    const updatedChallenge = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      tasks: filteredTasks.map(task => ({ description: task, is_completed: false })),
    };

    //원본
    //try {
    //  const response = await fetch(`http://localhost:8080/challenges/${id}`, {
    //    method: 'PATCH',
    //    headers: {
    //      'Content-Type': 'application/json',
    //    },
    //    body: JSON.stringify(updatedChallenge),
    //  });
    //
    //  if (response.ok) {
    //    navigate('/challenges');
    //  } else {
    //    console.error('Error updating challenge');
    //  }
    //} catch (error) {
    //  console.error('Error updating challenge:', error);
    //}

    //Axios 사용
    // try {
    //   const response = await axios.patch(`http://localhost:8080/challenges/${id}`, updatedChallenge, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    
    //   if (response.status === 200) {
    //     navigate('/challenges');
    //   } else {
    //     console.error('Error updating challenge');
    //   }
    // } catch (error) {
    //   console.error('Error updating challenge:', error);
    // }

    //로컬스토리지 사용
    try {
     const challenges = JSON.parse(localStorage.getItem('challenges'));
     const selectedChallenge = challenges.find(challenge => challenge.id === parseInt(id));
     const index = challenges.indexOf(selectedChallenge)
     // 새로운 데이터 추가
     const newChallenges = {...selectedChallenge, ...updatedChallenge};
     challenges[index] = newChallenges;
     // 업데이트된 데이터를 로컬스토리지에 저장
     localStorage.setItem('challenges', JSON.stringify(challenges));
     navigate(-1);
    } catch (error) {
     console.error('Error updating challenge:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className='ChallengeEdit'>
      <h1>챌린지 수정하기</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div>
          <input className='title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <textarea className='description' value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className='inputs'>
          <input className='date' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <input className='date' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <button className='add' type="button" onClick={handleOpenModal}>할 일 수정하기</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
        <div className='buttons'>
        <button className='cancel' type="button" onClick={handleCancel}>취소하기</button>
        <button className='create' type="submit">저장하기</button>
        </div>
      </form>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>할 일 수정하기</h2>
            {modalTasks.map((task, index) => (
              <input
                key={index}
                type="text"
                value={task}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                placeholder={`할 일 이름`}
              />
            ))}
            <button onClick={handleSaveTasks}>저장하기</button>
            <button onClick={() => setModalOpen(false)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeEdit;
