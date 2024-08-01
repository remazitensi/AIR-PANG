import React from "react";
import { Route, Routes } from 'react-router-dom';
import ChallengeList from "../components/Challenges/ChallengeList";
import ChallengeCreate from "../components/Challenges/ChallengeCreate";
import ChallengeDetail from "../components/Challenges/ChallengeDetail";
import ChallengeEdit from "../components/Challenges/ChallengeEdit";


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
