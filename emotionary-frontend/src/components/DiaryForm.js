import React, { useState } from 'react';
import axios from 'axios';

const DiaryForm = () => {
  const [entry, setEntry] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/diary', { entry });
      setFeedback('Diary entry successfully added!');
    } catch (error) {
      setFeedback('Error adding diary entry');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your diary entry..."
        />
        <button type="submit">Submit</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default DiaryForm;
