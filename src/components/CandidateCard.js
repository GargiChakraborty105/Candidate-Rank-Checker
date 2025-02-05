import React from 'react';
import './CandidateCard.css';
import { useStateContext } from "./StateContext";
const CandidateCard = ({ name,rank, score, onDownload }) => {
  const {darkMode} = useStateContext()
  return (
    <div className={`candidate-card ${darkMode ? 'dark-mode' : ''}`}>
      <h3>{name}</h3>
      <p>Rank : {rank}</p>
      <p>Similarity Score: {score}</p>
      <button onClick={onDownload}>Download Resume</button>
    </div>
  );
};

export default CandidateCard;