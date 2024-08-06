import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ChallengeCreate.css';
const apiUrl = process.env.REACT_APP_API_URL;

function ChallengeCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalTasks, setModalTasks] = useState(['', '', '', '', '']);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleError, setTitleError] = useState(''); // 제목 글자 수 초과 시 에러 메시지 상태
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

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

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length > 30) {
      setTitleError('30자 이상 적을 수 없습니다.');
    } else {
      setTitleError('');
    }
    setTitle(newTitle);
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

    try {
      const response = await axios.post(`${apiUrl}/challenges`, newChallenge, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // 여기로 이동
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/challenges');
      } else {
        console.error('Error creating challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleCancel = () => {
    navigate('/challenges');
  };

  const handleDeleteTask = (e, index) => {
    const newTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    e.preventDefault();
    setTasks(newTasks);
  };

  return (
    <div className='ChallengeCreate'>
      <h1>챌린지 생성하기</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <input
            className="title"
            type="text"
            placeholder="챌린지 제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
            required
          />
          {titleError && <p className="error">{titleError}</p>}
        </div>
        <div>
          <textarea
            className="description"
            placeholder="상세 내용을 입력해주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className='inputs'>
          <input
            className="date"
            id="start"
            type="date"
            data-placeholder="챌린지 시작일"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            className="date"
            id="end"
            type="date"
            data-placeholder="챌린지 종료일"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <p>*최소 2개의 할 일을 만들어 주세요.</p>
        <div>
          <button className="add" type="button" onClick={handleOpenModal}>할 일 만들기</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task} <a href="#" onClick={(e) => handleDeleteTask(e, index)}>X</a></li>
            ))}
          </ul>
        </div>
        <div className='buttons'>
          <button className="cancel" type="button" onClick={handleCancel}>취소하기</button>
          <button className="create" type="submit">만들기</button>
        </div>
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

export default ChallengeCreate;
