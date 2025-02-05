import React from 'react';
import './FileUploader.css';
import { useStateContext } from "./StateContext";

const FileUploader = ({ label, label_description, accept, multiple, onFileSelect }) => {
  const handleChange = (event) => {
    const files = event.target.files;
    if (multiple) {
      onFileSelect(Array.from(files));
    } else {
      onFileSelect(files[0]);
    }
  };
  const {darkMode} = useStateContext()
  
  return (
    <div className={`file-upload-container ${darkMode ? 'dark-mode' : ''}`}>
      <label>{label}</label>
      <p>{label_description}</p>
      <input type="file" accept={accept} multiple={multiple} onChange={handleChange} />
    </div>
  );
};

export default FileUploader;