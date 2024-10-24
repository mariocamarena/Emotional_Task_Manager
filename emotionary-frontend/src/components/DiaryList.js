import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editContent, setEditContent] = useState('');

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

    // Delete entry function
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/diary/${id}`);
        setEntries(entries.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    };

    // Enable editing mode
    const handleEdit = (entry) => {
      setEditingEntry(entry.id);
      setEditContent(entry.entry);
    };

    // Submit the updated entry
    const handleSubmitEdit = async (id) => {
      try {
        await axios.put(`http://localhost:5000/diary/${id}`, { entry: editContent });
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, entry: editContent } : entry)));
        setEditingEntry(null);
        setEditContent('');
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    };


  return (
    <div>
      <h2>Your Diary Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {editingEntry === entry.id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleSubmitEdit(entry.id)}>Save</button>
                <button onClick={() => setEditingEntry(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{entry.entry}</p>
                <small>{entry.date}</small>
                <p>Emotion: {entry.emotionFeedback}</p>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryList;
