import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/diary');
        setEntries(response.data);
        setMessage('');
      } catch (error) {
        console.error('Error fetching diary entries:', error);
      } finally {
        setLoading(false);
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
        setMessage('Error deleting entry.');
      } finally {
        setLoading(false);
      }
    };

    // Enable editing mode
    const handleEdit = (entry) => {
      setEditingEntry(entry.id);
      setEditContent(entry.entry);
      setMessage('');
    };

    // Submit the updated entry
    const handleSubmitEdit = async (id) => {
      setLoading(true);
      try {
        await axios.put(`http://localhost:5000/diary/${id}`, { entry: editContent });
        setEntries(entries.map((entry) => (entry.id === id ? { ...entry, entry: editContent } : entry)));
        setEditingEntry(null);
        setMessage('Entry updated successfully.');
        setEditContent('');
      } catch (error) {
        setMessage('Error updating entry.');
      } finally {
        setLoading(false);
      }
    };


    return (
      <div>
        <h2>Your Diary Entries</h2>
  
        {loading && <p>Loading...</p>} {/*  */}
  
        {message && <p>{message}</p>} {/*  */}
  
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              {editingEntry === entry.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    disabled={loading} // Disable textarea while loading
                  />
                  <button onClick={() => handleSubmitEdit(entry.id)} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'} {/* Show saving state */}
                  </button>
                  <button onClick={() => setEditingEntry(null)} disabled={loading}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{entry.entry}</p>
                  <small>{entry.date}</small>
                  <p>Emotion: {entry.emotionFeedback}</p>
                  <button onClick={() => handleEdit(entry)} disabled={loading}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(entry.id)} disabled={loading}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default DiaryList;
