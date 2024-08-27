import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import "../../styles/ChallengeStatus.css";

const apiUrl = process.env.REACT_APP_API_URL;

const ChallengeStatus = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${apiUrl}/my`, {
        withCredentials: true,
      });
      setChallenges(response.data.challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleTaskCompletionToggle = async (challengeId, taskId) => {
    try {
      const updatedChallenges = challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            tasks: challenge.tasks.map((task) =>
              task.id === taskId
                ? { ...task, is_completed: !task.is_completed }
                : task
            ),
          };
        }
        return challenge;
      });

      setChallenges(updatedChallenges);

      const updatedTask = updatedChallenges
        .find((challenge) => challenge.id === challengeId)
        .tasks.find((task) => task.id === taskId);

      await axios.patch(`${apiUrl}/tasks/${taskId}`, updatedTask, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to update task status on server:", error);
    }
  };

  function calculateDaysLeft(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const timeDiff = target - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="ChallengeStatus">
      <h1 className="challenge-status-title">나의 챌린지 현황</h1>
      <div className="StatusLists">
        {challenges.map((challenge) => {
          let count = challenge.tasks.length;
          let completedCount = challenge.tasks.filter(
            (task) => task.is_completed
          ).length;
          let label = Math.round((completedCount / count) * 100);

          if (completedCount === 0) {
            completedCount = 1;
            count = 8;
            label = 0;
          }

          return (
            <div className="StatusList" key={challenge.id}>
              <span>
                {calculateDaysLeft(challenge.start_date) >= 1 ? (
                  <div>{calculateDaysLeft(challenge.start_date)}일 후 시작</div>
                ) : calculateDaysLeft(challenge.end_date) < 0 ? (
                  <div>종료</div>
                ) : (
                  <div>진행중</div>
                )}
              </span>
              <h3 className="my-page-challenge-title">{challenge.title}</h3>
              <ProgressBar
                completed={completedCount}
                maxCompleted={count}
                customLabel={`${label}%`}
                width="148px"
                height="16px"
                baseBgColor="#D9D9D9"
                bgColor="linear-gradient(to right, #CDEDFF, #00A3FF)"
                labelSize="10px"
                labelAlignment="right"
              />
              <ul>
                {challenge.tasks.map((task) => (
                  <li key={task.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() =>
                          handleTaskCompletionToggle(challenge.id, task.id)
                        }
                      />{" "}
                      {task.description}
                    </label>
                  </li>
                ))}
              </ul>
              <Link className="link" to={`/challenges/${challenge.id}`}>
                내 챌린지 보러가기
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeStatus;
