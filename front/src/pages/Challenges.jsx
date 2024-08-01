import React from "react";
import { Route, Routes } from 'react-router-dom';
import ChallengeDetail from "../components/Challenges/ChallengeDetail";
import ChallengeCreate from "../components/Challenges/ChallengeCreate";
import ChallengeEdit from "../components/Challenges/ChallengeEdit";
import ChallengeList from "../components/Challenges/ChallengeList";

function Challenges() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChallengeList />} />
        <Route path="create" element={<ChallengeCreate />} />
        <Route path=":id" element={<ChallengeDetail />} />
        <Route path="edit/:id" element={<ChallengeEdit />} />
      </Routes>
    </div>
  );
}

export default Challenges;
