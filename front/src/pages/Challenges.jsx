import React from 'react';
import ChallengeDetail from '../components/Challenges/ChallengeDetail';
import ChallengeCreate from '../components/Challenges/ChallengeCreate';
import ChallengeEdit from '../components/Challenges/ChallengeEdit';
import ChallengeList from '../components/Challenges/ChallengeList';


function Challenges() {
  return (
    <div>
      <ChallengeCreate />
      <ChallengeDetail />
      <ChallengeEdit />
      <ChallengeList />
    </div>
  );
}

export default Challenges;