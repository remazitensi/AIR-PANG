import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/ChallengeEdit.css";
const apiUrl = process.env.REACT_APP_API_URL;

function ChallengeEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [modalTasks, setModalTasks] = useState(["", "", "", "", ""]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`${apiUrl}/challenges/${id}`, {
          withCredentials: true,
        });
        const data = response.data;
        setTitle(data.challenge.title);
        setDescription(data.challenge.description);
        setStartDate(data.challenge.start_date.split("T")[0]);
        setEndDate(data.challenge.end_date.split("T")[0]);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching challenge:", error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...modalTasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setModalTasks(newTasks);
  };

  const handleSaveTasks = () => {
    setTasks(modalTasks.filter((task) => task.description.trim() !== ""));
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalTasks(
      tasks.length > 0
        ? tasks
            .concat(
              Array(5 - tasks.length).fill({
                id: "",
                description: "",
                is_completed: false,
              })
            )
            .slice(0, 5)
        : Array(5).fill({ id: "", description: "", is_completed: false })
    );
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      alert("종료일은 시작일보다 이전 날짜일 수 없습니다.");
      return;
    }

    const filteredTasks = tasks.filter(
      (task) => task.description.trim() !== ""
    );

    if (filteredTasks.length === 0) {
      alert("최소 1개의 할 일을 추가해야 합니다.");
      return;
    }

    const updatedChallenge = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/challenges/${id}`,
        updatedChallenge,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        await Promise.all(
          filteredTasks.map(async (task) => {
            if (task.id) {
              await axios.patch(`${apiUrl}/tasks/${task.id}`, task, {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              });
            } else {
              await axios.post(
                `${apiUrl}/tasks`,
                { challenge_id: id, description: task.description },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );
            }
          })
        );
        navigate(`/challenges/${id}`);
      } else {
        console.error("Error updating challenge");
      }
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeleteTask = (e, index) => {
    const taskToDelete = tasks[index];
    const newTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    e.preventDefault();
    setTasks(newTasks);

    if (taskToDelete.id) {
      axios
        .delete(`${apiUrl}/tasks/${taskToDelete.id}`, {
          withCredentials: true,
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };

  return (
    <div className="ChallengeEdit">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="challenge-edit-title">챌린지 수정하기</h1>
        <div>
          <input
            className="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            className="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="inputs">
          <input
            className="date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            className="date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="challenge-edit-list">
          <button className="add" type="button" onClick={handleOpenModal}>
            할 일 수정하기
          </button>
          <ul>
            {tasks.map((task, index) => (
              <li key={task.id}>
                {task.description}{" "}
                <a href="#" onClick={(e) => handleDeleteTask(e, index)}>
                  X
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="buttons">
          <button className="cancel" type="button" onClick={handleCancel}>
            취소하기
          </button>
          <button className="create" type="submit">
            저장하기
          </button>
        </div>
      </form>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>할 일 수정하기</h2>
            <p>할 일은 최대 5개까지 생성 가능합니다.</p>
            {modalTasks.map((task, index) => (
              <input
                key={index}
                type="text"
                value={task.description}
                onChange={(e) =>
                  handleTaskChange(index, "description", e.target.value)
                }
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
