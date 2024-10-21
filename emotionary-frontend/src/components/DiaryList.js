import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiaryList = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/diary');
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching diary entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div>
      <h2>Your Diary Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <p>{entry.entry}</p>
            <small>{entry.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryList;
