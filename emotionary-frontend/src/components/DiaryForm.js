import React, { useState } from 'react';
import axios from 'axios';

const DiaryForm = () => {
  const [entry, setEntry] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entry.trim()) {
      setFeedback('Error: Diary entry cannot be empty.');
      return;
    }

    try {
      //POST request for new diary entry
      const response = await axios.post('http://localhost:5000/diary', { entry });
      setFeedback('Diary entry successfully added!');
      setEntry(''); // Clear the input field after successful submission
    } catch (error) {

      if (error.response) {
        setFeedback(`Error: ${error.response.data.message || 'Failed to add diary entry'}`);
      } else if (error.request) {
        setFeedback('Error: No response from the server. Please try again later.');
      } else {
        setFeedback('Error: Unable to submit diary entry.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your diary entry..."
          rows="5"
          cols="30"
        />
        <button type="submit">Submit</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default DiaryForm;
