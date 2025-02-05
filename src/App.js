import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import CandidateCard from './components/CandidateCard';
import './App.css';
import { useStateContext } from "./components/StateContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const {darkMode, setDarkMode} = useStateContext()
  const [jobDescription, setJobDescription] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleUpload = async () => {
    try{
    const formData = new FormData();
    formData.append('jd', jobDescription);
    resumes.forEach((resume) => {
      formData.append('resumes', resume);
    });
    const response = await fetch('http://localhost:8000/rank-candidates/', {
      method: 'POST',
      body: formData,
    });
    const res = await response.json();
    const data = res.candidates
    setResults(data);
  }
  catch(error){
    window.alert('An error occurred: ' + error.message);
  }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>Job-Resume Matcher
        <i 
          onClick={toggleDarkMode} 
          className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} 
          style={{ position: 'absolute', right: "3vw", fontSize: '32px', cursor: 'pointer'}}
        ></i>
        </h1>
      </header>

      <div className="upload-section">
        <FileUploader
          label="Upload Job Description"
          accept="application/pdf"
          multiple={false}
          onFileSelect={(file) => setJobDescription(file)}
        />
        <FileUploader
          label="Upload Resumes"
          label_description="Name of the pdfs must be 'Candidate_Name.pdf'"
          accept="application/pdf"
          multiple={true}
          onFileSelect={(files) => setResumes(files)}
        />
      </div>

      <button onClick={handleUpload} className="submit-button">
        Analyze
      </button>

      <div className="results-section">
        {results.map((result, index) => (
          <CandidateCard
            key={index}
            rank={result.Rank}
            name={result.Name}
            score={result.Confidence_Score}

            onDownload={() => window.open(result.Resume, '_blank')}
          />
        ))}
      </div>
    </div>
  );
};

export default App;